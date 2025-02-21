import { useNavigate } from "react-router-dom"

export function Benvenuto(){
    const navTo= useNavigate()
    return(
        <>
        

        <div className="benvenuto">

            <div className="Benvenuto-loghi">
            <img src="src/assets/loghi/logo.svg" width={250} alt="logo" />
            <img src="src/assets/loghi/party.svg" width={150} alt="party" />
            </div>
           
           <div className="benvenuto-testo">
            <h3>Registrazione terminata!</h3>
            <h2>Benvenuto su RAMBERLY!</h2>
           </div>

           <button onClick={()=>navTo('/login')}>Vai al login</button>
        </div>
        </>
    )
}