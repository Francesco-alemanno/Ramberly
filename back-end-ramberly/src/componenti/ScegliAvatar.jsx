import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";

export function ScegliAvatar() {
  const [img, setImg] = useState({
    img: "",
  });
  const { userId } = useUserContext();
  const [message, setMessage] = useState("");
  const navTo = useNavigate();

  function handleImage(event) {
    const { src, alt } = event.target;
    setImg({ [alt]: src });
    console.log(img);
  }

  const benvenuto = () => {
    navTo("/benvenuto");
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5001/scegliAvatar/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(img),
        }
      );

      let responseimg;
      try {
        responseimg = await response.json();
      } catch (error) {
        throw new Error(error.message);
      }

      if (!response.ok) {
        throw new Error(
          responseimg.message || "Errore durante l'inserimento dell'avatar."
        );
      }

      setMessage("avatar inserito con successo");
      // Reset campi
      navToScegliSport();
    } catch (error) {
      setMessage(`inserimento avatar fallito: ${error.message}`);
    }

    benvenuto();
    //switch
  }

  return (
    <div className="main-container">
      <img
        style={{ marginBottom: "20px" }}
        src="src/assets/loghi/logo.svg"
        width={160}
        alt="logo"
      />
      <img
        src="src/assets/icons/step4.svg"
        width={280}
        style={{ marginBottom: "10px" }}
        alt=""
      />

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
            alt="img"
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Helmet-Lady.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Helmet-Male.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Hiking-Lady.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Hiking-Male.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Running-Lady.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Running-Male.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Senior-Walking-Lady.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Yung-Helmet-Lady.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Yung-Helmet-Male.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Yung-Hiking-Lady.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
          <img
            src="\src\assets\avatar\Avatar-Yung-Hiking-Male.webp"
            width={70}
            alt="img"
            nome={img.img}
            onClick={handleImage}
            loading="lazy"
          />
        </div>

        <button type="submit" className="prosegui" onClick={handleSubmit}>
          Avanti
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
