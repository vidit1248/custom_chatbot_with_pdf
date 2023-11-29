const PORT = 8000
const express = require('express')
const cors = require('cors')
require ('dotenv').config()
const app = express()

app.use(express.json())
app.use(cors())

const API_KEY = process.env.API_KEY
/*
const prompt = "Who is Hassan Djirdeh?"

// after some work, we determine the following contextual information to be closest in similarity to the prompt question above.
const textWithHighestScore = "Hassan Djirdeh is a front-end engineer..."

const finalPrompt = `
  Info: ${textWithHighestScore}
  Question: ${prompt}
  Answer:
`;
*/


app.post ('/completions', async (req, res) => {
    const option_for_promt = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: req.body.message,
        })
    }
    
    // Get Final Prompt from Python Server and then from OpenAI
    //try {
        const response = await fetch ('http://127.0.0.1:5000/get_final_prompt', option_for_promt)
        const finalPrompt = await response.json()
        console.log (finalPrompt.finalPromptString)
        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: finalPrompt.finalPromptString,
                max_tokens: 64,
            })
        }
        try {
            const response = await fetch ('https://api.openai.com/v1/completions', options)
            const data = await response.json()
            console.log (data)
            res.send (data)
        } catch (error) {
            console.log ("Error in API Call")
            console.error();
        }
        
    /*} catch (error) {
        console.log ("Error in Python API Call")
        console.error();
    }*/

    
})


app.listen(PORT, () => console.log ("Server running on PORT " + PORT))



