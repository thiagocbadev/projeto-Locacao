const Space = require('../models/space');
const Reservation = require('../models/reservation');

class SpaceController {

    async create(req, res) {
        try {
            const space = await Space.create(req.body)
            return res.status(201).json(space)
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar espaço', details: error.message })
        }
    }

    async list(req, res) {
        try {
            const { type, capacity } = req.query

            const filter = {}

            if (type) {
                filter.type = type
            }

            if (capacity) {
                const minCapacity = parseInt(capacity);

                if (!isNaN(minCapacity) && minCapacity > 0) {
                    filter.capacity = { $gte: minCapacity }
                } else if (isNaN(minCapacity)) {
                    return res.status(400).json({ error: 'Capacidade inválida. Deve ser um número inteiro.' })
                }
            }

            const spaces = await Space.find(filter).sort('name')
            return res.json(spaces)

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar espaços', details: error.message })
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const space = await Space.findById(id);

            if (!space) {
                return res.status(404).json({ error: 'Espaço não encontrado' });
            }

            return res.json(space);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar espaço', details: error.message });
        }
    }

    async remove(req, res) {
        const { id } = req.params;

        try {
            await Reservation.deleteMany({ spaceId: id });

            const space = await Space.findByIdAndDelete(id);

            if (!space) {
                return res.status(404).send({ message: 'Espaço não encontrado.' });
            }

            return res.status(200).send({ message: 'Espaço e reservas associadas deletados com sucesso.' });
        } catch (error) {
            console.error("Erro ao deletar espaço:", error);
            return res.status(500).send({ message: 'Erro interno ao deletar o espaço.' });
        }
    }
}

module.exports = new SpaceController()