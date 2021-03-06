const Users = require('../models/User')
const Board = require('../models/Boards')
const Task = require("../models/Task")

const boardController = {
    index: (req, res) => {
        const userID = req.params.id
        const boardID = req.params.boardId

        Users.findById(userID).populate('boards').then(
            (returnedBoards) => {
                const boards = returnedBoards.boards
                res.render('boards/index', { boards: boards, userID: userID })
            })
    },
    new: (req, res) => {
        const userID = req.params.id
        res.render('boards/new', { userID: userID })
    },
    create: (req, res) => {

        const userID = req.params.id
        Users.findById(userID).populate('boards')
            .then((returnedBoards) => {

                Board.create(req.body)
                    .then((board) => {
                        returnedBoards.boards.push(board)
                        returnedBoards.save()
                        res.redirect(`/${userID}/board`)
                    })
            })
    },
    show: (req, res) => {
        const boardID = req.params.boardId
        const userID = req.params.id
        Board.findById(boardID).populate('tasks').then((board) => {
            const tasks = board.tasks
            const name = board.name
            res.render('boards/show', { board: board, name: name, tasks: tasks, userID: userID })
        }).catch((err) => {
            console.log(err)
        })
    },
    edit: (req, res) => {

        const userID = req.params.id
        const boardID = req.params.boardId
        res.render('boards/edit', { userID, boardID })
    },
    update: (req, res) => {
        const userID = req.params.id
        const boardID = req.params.boardId
        Board.findByIdAndUpdate(boardID, req.body, { new: true })
            .then((board) => {
                res.redirect(`/${userID}/board/${boardID}`)
            })
    },
    delete: (req, res) => {
        const userID = req.params.id
        const boardId = req.params.boardId
        Board.findByIdAndDelete(boardId)
            .then(() => {
                res.redirect(`/${userID}/board`)
            })
    }
}

module.exports = boardController