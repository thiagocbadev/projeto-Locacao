const Reservation = require('../models/reservation')
const Space = require('../models/space')
const User = require('../models/user')

class ReservationController {

    async create(req, res) {
        const { spaceId, userId, start, end } = req.body

        if (!spaceId || !userId || !start || !end) {
            return res.status(400).json({
                error: 'Dados incompletos',
                message: 'spaceId, userId, start e end são obrigatórios.'
            })
        }

        let startTime, endTime;
        try {
            startTime = new Date(start);
            endTime = new Date(end);

            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                return res.status(400).json({
                    error: 'Formato de Data Inválido',
                    message: 'As datas de início e fim devem estar em um formato válido (ex: ISO 8601).'
                })
            }

            if (startTime >= endTime) {
                return res.status(400).json({ error: 'O tempo de fim deve ser estritamente posterior ao tempo de início.' })
            }

        } catch (e) {
            return res.status(400).json({ error: 'Erro de processamento de data/hora.', details: e.message })
        }

        try {
            const space = await Space.findById(spaceId);
            if (!space) {
                return res.status(404).json({ error: 'Espaço não encontrado.' });
            }

            const pricePerHour = space.pricePerHour || 0;

            const durationMs = endTime.getTime() - startTime.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);
            const totalCost = durationHours * pricePerHour;

            const conflict = await Reservation.findOne({
                spaceId,
                $or: [
                    { start: { $lt: endTime }, end: { $gt: startTime } }
                ]
            })

            if (conflict) {
                return res.status(400).json({
                    error: 'Conflito de horário: espaço já reservado neste período',
                    message: 'Conflito de horário: o espaço já está reservado no período especificado.',
                    conflictDetails: { start: conflict.start, end: conflict.end }
                })
            }

            const reservation = await Reservation.create({
                spaceId,
                userId,
                start: startTime,
                end: endTime,
                totalCost: totalCost
            })

            return res.status(201).json({
                message: 'Reserva criada com sucesso.',
                reservation: reservation,
                totalCost: totalCost
            })

        } catch (error) {
            console.error('Erro no Create de Reserva:', error)
            return res.status(500).json({
                error: 'Erro interno ao processar a reserva',
                details: error.message
            })
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { spaceId, userId, start, end } = req.body

        try {
            const existing = await Reservation.findById(id)
            if (!existing) {
                return res.status(404).json({ error: 'Reserva não encontrada.' })
            }

            const newSpaceId = spaceId || existing.spaceId
            const newUserId = userId || existing.userId

            if (!start && !end && !spaceId && !userId) {
                return res.status(400).json({
                    error: 'Nenhum dado para atualização.',
                    message: 'Envie pelo menos um campo para atualizar.'
                })
            }

            let startTime = existing.start
            let endTime = existing.end

            if (start) {
                startTime = new Date(start)
            }
            if (end) {
                endTime = new Date(end)
            }

            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                return res.status(400).json({
                    error: 'Formato de Data Inválido',
                    message: 'As datas de início e fim devem estar em um formato válido (ex: ISO 8601).'
                })
            }

            if (startTime >= endTime) {
                return res.status(400).json({ error: 'O tempo de fim deve ser estritamente posterior ao tempo de início.' })
            }

            const space = await Space.findById(newSpaceId);
            if (!space) {
                return res.status(404).json({ error: 'Espaço não encontrado.' });
            }

            const pricePerHour = space.pricePerHour || 0;
            const durationMs = endTime.getTime() - startTime.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);
            const totalCost = durationHours * pricePerHour;

            const conflict = await Reservation.findOne({
                _id: { $ne: id },
                spaceId: newSpaceId,
                $or: [
                    { start: { $lt: endTime }, end: { $gt: startTime } }
                ]
            })

            if (conflict) {
                return res.status(400).json({
                    error: 'Conflito de horário: espaço já reservado neste período',
                    message: 'Conflito de horário: o espaço já está reservado no período especificado.',
                    conflictDetails: { start: conflict.start, end: conflict.end }
                })
            }

            existing.spaceId = newSpaceId
            existing.userId = newUserId
            existing.start = startTime
            existing.end = endTime
            existing.totalCost = totalCost

            const updated = await existing.save()

            const populated = await updated
                .populate('spaceId')
                .populate('userId')

            return res.json({
                message: 'Reserva atualizada com sucesso.',
                reservation: populated,
                totalCost: totalCost
            })

        } catch (error) {
            console.error('Erro ao atualizar reserva:', error)
            return res.status(500).json({
                error: 'Erro interno ao atualizar a reserva',
                details: error.message
            })
        }
    }

    async list(req, res) {
        try {
            const filter = {}
            if (req.query.startAfter) {
                const filterDate = new Date(req.query.startAfter);
                if (isNaN(filterDate.getTime())) {
                    return res.status(400).json({ error: 'Formato de data inválido para o filtro startAfter.' })
                }
                filter.start = { $gte: filterDate }
            }

            const reservations = await Reservation.find(filter)
                .populate('spaceId')
                .populate('userId')
                .sort('start')

            return res.json(reservations)
        } catch (error) {
            console.error('Erro ao listar reservas:', error);
            return res.status(500).json({ error: 'Erro ao listar reservas', details: error.message })
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const reservation = await Reservation.findById(id)
                .populate('spaceId')
                .populate('userId');

            if (!reservation) {
                return res.status(404).json({ error: 'Reserva não encontrada' });
            }

            return res.json(reservation);
        } catch (error) {
            console.error('Erro ao buscar detalhe da reserva:', error);
            return res.status(500).json({ error: 'Erro ao buscar reserva', details: error.message });
        }
    }

    async remove(req, res) {
        const { id } = req.params;

        try {
            const reservation = await Reservation.findByIdAndDelete(id);

            if (!reservation) {
                return res.status(404).send({ message: 'Reserva não encontrada.' });
            }

            return res.status(200).send({ message: 'Reserva deletada com sucesso.' });
        } catch (error) {
            console.error("Erro ao deletar reserva:", error);
            return res.status(500).send({ message: 'Erro interno ao deletar a reserva.' });
        }
    }
}

module.exports = new ReservationController()