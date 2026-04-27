import { useState } from "react";
// import { useEffect } from "react";
const InputBox = () =>{
const [buttonx, setButtonx]= useState("Analyze Website");
const [text, setText] = useState("");
const[result, setResult] = useState("");
const[score, setScore] = useState("");

const handleAnalyze = async()=>{
        if(!text) return alert("Please enter a URL");
        try{
            setButtonx("Analyzing...");
           //https://ai-readiness-audit-page.onrender.com OR http://localhost:5000/audit
            const response = await fetch("https://ai-readiness-audit-page.onrender.com/audit/",{
                method: "POST",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify({url: text})
            });
            const data = await response.json();
            setResult(data);
            setScore(data.score);
            setButtonx("Website Analyzed");
        } catch(error){
        console.error(error);
        setButtonx("Error");
    }
    finally{
        setText("")
    }
    }

    return(
        <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center">
        <h1 className="text-black text-4xl text-center font-bold pt-10">AI Readiness Audit</h1>
        <p className="text-black text-1xl text-center pt-6">
  Ensure your content is optimised for how AI processes it. Identify and fix technical issues blocking AI understanding. <br />
  Make your website easier for AI systems to read and use.
</p>
        {/* <h2 className="text-black text-1xl text-center pt-6">Ensure your content is optimised for the way AI really processes it. Identify and Fix the technical issues that prevent AI systems from recognizing your content.</h2> */}
        <div className=" flex mx-50 py-6">
            <input 
        type = "text"
        placeholder = "Enter a Domain or Website URL"
        value={text}
        onChange={(e)=>setText(e.target.value)}
        className="px-2 py-1 grow border-black border-3 border-solid rounded-md text-black bg-white"
        ></input>
        <button onClick={handleAnalyze} className= "px-2 py-2 border-3 border-solid cursor-pointer bg-black border-white hover:bg-cyan-400 hover:text-black hover:border-black rounded-md text-white">{buttonx}</button>
        </div>
        <h1 className="text-center text-black">For Example: microsoft.com or google.com</h1>

{/* Show result */}

            {result && (
                <div className="text-black p-5">
                    {/* score */}
                    <h2 className="text-2xl font-bold text-center">AI Audit Score: {score}/100</h2>
                    {/* issues */}
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                
                </div>
            )}
        </div>
    )
}
export default InputBox;