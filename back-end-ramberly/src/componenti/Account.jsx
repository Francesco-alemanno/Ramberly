import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";

export function Account() {
  const { user, avatar } = useUserContext();
  const navTo= useNavigate()
  return (
    <>
    <div>
         <a className="link-class" style={{position:'absolute', right:'365px', marginTop:'10px'}} onClick={() => navTo("/home")}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 18 28"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.825 28L18 14 1.825 0 0 1.715 14.196 14 0 26.285z"
        fill="currentColor"
      ></path>
    </svg>
  </a>
    </div>
    <div className="account">
        
        <div className="account-titolo">
        <img src="src/assets/navbar/utente.svg" width={35} alt="logo-utente" />
        <h3>Il tuo account</h3>
        </div>
               

      <div >
        
        <img src={avatar} style={{borderRadius:'50%'}} width={100} alt="avatar" />
        <div >
        <h2>
          {user.nome} 
        </h2>
        </div>
        
        
      </div>
      <hr />
      <div className="account-impostazioni">
      <h3>Gestisci account</h3>
      <h3 onClick={()=>navTo('/eventipreferiti')}>I miei eventi</h3>
      <h3>I miei amici</h3>
      <h3 onClick={()=>navTo('/impostazioni')}>Impostazioni</h3>
      <h3 onClick={()=>navTo('/login')}>Logout</h3>
      </div>
      <div account-social>
      <img src="src/assets/loghi/social.svg"  alt="social network" />

      </div>
    </div>
    </>
  );
}
