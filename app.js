import express from 'express'


import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url)); // https://nodejs.org/docs/latest-v12.x/api/esm.html#esm_no_require_exports_module_exports_filename_dirname

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) 


const server = app.listen( process.env.port || 3000, (error) => {
    error ? console.log(error) : console.log('Server listening on port', server.address().port)
})