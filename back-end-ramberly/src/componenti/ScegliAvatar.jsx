import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contesti/useContext";

export function ScegliAvatar() {
  const [url, setUrl] = useState("");

  const navTo = useNavigate();
  ;

  const { setIsLogged } = useContext(UserContext);

  setIsLogged(false);

  const user = localStorage.getItem("user");
  const parseUser = JSON.parse(user);

  const users = localStorage.getItem("users");
  const parseUsers = JSON.parse(users);

  const userImg = {
    ...parseUser,
    img: url,
  };

  function handleImage(event) {
    const src = event.target.src;
    setUrl(src);

    const UpdatedUserImg = {
      ...parseUser,
      img: src,
    };

    localStorage.setItem("user", JSON.stringify(UpdatedUserImg));
  }

  const benvenuto = () => {
    navTo("/benvenuto");
  };

  function handleSubmit(event) {
    event.preventDefault();

    parseUsers.push(userImg);
    localStorage.setItem("users", JSON.stringify(parseUsers));

    localStorage.setItem("user", "");

    benvenuto();
    //switch
  }

  return (
    <div className="main-container">
            <img style={{marginBottom:'20px'}} src="src/assets/loghi/logo.svg" width={160} alt="logo" />
            <img src="src/assets/icons/step4.svg" width={280} style={{marginBottom:'10px'}} alt="" />

      <div className="form">
       
        <div className="avatar-title">
          <div>
          <a href="/potresticonoscere" className="link-class">
            <svg
              width="10"
              height="20"
              viewBox="0 0 18 28"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="Icon__StyledSVG-sc-lm07h6-0 rBpBu Chevronstyles__ChevronIcon-sc-1qql32m-0 gxjmBc GlobalBannerstyles__ControlIcon-sc-adnc4-6 llnoGO"
            >
              <path
                d="M1.825 28L18 14 1.825 0 0 1.715 14.196 14 0 26.285z"
                fill="currentColor"
              ></path>
            </svg>
          </a>
          </div>
          
<div>
<h3 className="link-h3-class">Scegli il tuo avatar!</h3>

</div>
         

        </div>
        <div className="avatar-container">
          <img
            src="\src\assets\avatar\Avatar-old-Walking-Lady.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Helmet-Lady.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Helmet-Male.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Hiking-Lady.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Hiking-Male.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Running-Lady.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Running-Male.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Walking-Lady.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Yung-Helmet-Lady.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Yung-Helmet-Male.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Yung-Hiking-Lady.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Yung-Hiking-Male.webp"
            width={70}
            alt="avatar1"
            onClick={handleImage}
            loading="lazy"
          />
        </div>

        <button type="submit" className="prosegui" onClick={handleSubmit}>
          Avanti
        </button>
      </div>
    </div>
  );
}
