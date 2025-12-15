const User = require('../models/user');
const Reservation = require('../models/reservation');

class UserController {

    async create(req, res) {
        try {
            const user = await User.create(req.body)
            return res.status(201).json(user)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao criar usuário', details: error.message })
        }
    }

    async list(req, res) {
        try {
            const users = await User.find()
            return res.json(users)
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar usuários', details: error.message })
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        if (!name && !email && !phone) {
            return res.status(400).json({
                error: 'Nenhum dado para atualização.',
                message: 'Envie pelo menos um campo (name, email ou phone) para atualizar.'
            });
        }

        try {
            const user = await User.findByIdAndUpdate(
                id,
                { $set: { ...(name && { name }), ...(email && { email }), ...(phone && { phone }) } },
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.json({ message: 'Usuário atualizado com sucesso.', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
        }
    }

    async remove(req, res) {
        const { id } = req.params;

        try {
            await Reservation.deleteMany({ userId: id });

            const user = await User.findByIdAndDelete(id);

            if (!user) {
                return res.status(404).send({ message: 'Usuário/Cliente não encontrado.' });
            }

            return res.status(200).send({ message: 'Usuário/Cliente e reservas associadas deletados com sucesso.' });
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            return res.status(500).send({ message: 'Erro interno ao deletar o usuário.' });
        }
    }
}

module.exports = new UserController()