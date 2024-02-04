import React from "react";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 flex-row">
      <p>
        Confirmer votre identité pour recevoir <strong>75DT</strong>.
      </p>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* Placeholder for logo; replace src with your logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://logohistory.net/wp-content/uploads/2022/10/Facebook-Logo-2019.png"
            alt="Logo"
            className="h-24"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">
          Log in to Your Account
        </h1>

        <form>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              placeholder="Adresse e-mail ou numéro de tél."
            />
          </div>

          <div className="mb-6">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Mot de passe"
            />
          </div>

          <div className="mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Se connecter
            </button>
          </div>

          <div className="text-center">
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#!"
            >
              Mot de passe oublié ?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
