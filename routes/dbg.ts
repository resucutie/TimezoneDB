import { Router, Response } from "express"

const DebguRouter = Router();

DebguRouter.get('/', (req, res) => {
    res.send(`
    <h1>welcome to le debug menu</h1>
    <div>
        <span><b>your cookies btw:</b> ${JSON.stringify(req.cookies)}</span>
        <button onclick="window.location.href='/dbg/deleteCookeis'"> delete cookies </button>
    </div>
    <a href="/api/auth">login page</a>
    `)
})

DebguRouter.get('/deleteCookeis', (req, res) => {
    for (const key in req.cookies) {
        res.clearCookie(key)
    }
    res.redirect("../")
})

// OAuth2Router.get("/callback", async (req, res) => {
//     res.status(constants.StatusCodes.MOVED_PERMANENTLY).redirect("login" + new URL(req.url, `http://${req.headers.host}/`).search)
// })

export default DebguRouter;