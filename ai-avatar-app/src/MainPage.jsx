{/*import waspLogo from './waspLogo.png'*/}
import './Main.css'

export const MainPage = () => {
  return (
    <div className="container">
      <main>
        <div className="logo">
          {/*<img src={insert logo here} alt="wasp" />*/}
        </div>

        <h2 className="welcome-title">
          Create the visuals for the site later (just get AI to write code for react/css files)
        </h2>
        <h3 className="welcome-subtitle">
          This is page <code>MainPage</code> located at route <code>/</code>.
          Open <code>src/MainPage.jsx</code> to edit it.
        </h3>

        <div className="buttons">
          <a
            className="button button-filled"
            href="https://wasp.sh/docs/tutorial/create"
            target="_blank"
            rel="noreferrer noopener"
          >
            Take the Tutorial
          </a>
          <a
            className="button button-outline"
            href="https://discord.com/invite/rzdnErX"
            target="_blank"
            rel="noreferrer noopener"
          >
            Chat on Discord
          </a>
        </div>
      </main>
    </div>
  )
}
