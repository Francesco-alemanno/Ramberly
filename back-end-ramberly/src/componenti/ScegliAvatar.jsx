import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contesti/useContext";

export function ScegliAvatar() {
  const [imgFile, setImgFile] = useState(null);
  const { userId } = useUserContext();
  const [message, setMessage] = useState("");
  const navTo = useNavigate();

  function handleImage(event) {
    const imgSrc = event.target.src;

    // Convertiamo l'URL dell'immagine in un file blob
    fetch(imgSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "avatar.png", { type: "image/png" });
        setImgFile(file);
      })
      .catch((err) =>
        console.error("Errore nel caricamento dell'immagine:", err)
      );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!imgFile) {
      setMessage("Seleziona un avatar prima di continuare!");
      return;
    }

    const formData = new FormData();
    formData.append("img", imgFile);

    try {
      const response = await fetch(
        `http://localhost:5001/scegliAvatar/${userId}`,
        {
          method: "PUT",
          body: formData, // Inviamo il file come FormData
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante l'inserimento dell'avatar.");
      }

      setMessage("Avatar inserito con successo");
      navTo("/benvenuto"); // Redirect dopo il successo
    } catch (error) {
      setMessage(`Inserimento avatar fallito: ${error.message}`);
    }
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
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
