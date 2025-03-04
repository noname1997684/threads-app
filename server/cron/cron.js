import cron from "cron";
import https from "https";

const URL="https://threadsweb.onrender.com";
const job= new cron.CronJob("*/14 * * * *",function(){
    https.get(URL,(res)=>{
        if(res.statusCode ===200){
            console.log("Get request to "+URL+" successful");

        }
        else{
            console.log("Get request to "+URL+" failed",res.statusCode);
        }
    }).on("error",(e)=>{
        console.log("Error in sending request: "+e.message);
    })

})

export default job;