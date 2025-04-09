import React, { useState, useEffect } from "react";
import { getIcon } from "../services/app-service";
import App from "../types/app";

const AppBox = ({ app }: AppBoxProps) => {
    const [iconUrl, setIconUrl] = useState<string | null>(null);

    useEffect(() => {
        getIcon(app.location, app.isWeb)
            .then((icon) => {
                setIconUrl(icon);
            })
            .catch((error) => {
                console.error("Error fetching icon:", error);
            });
    }, [app.location, app.isWeb]);

    return (
        <button
            className="p-4 rounded-lg w-40 items-center justify-center m-4 hover:bg-foreground clickable focusable transitioning"
            onClick={() => { }}
        >
            <img src={iconUrl} alt={app.name} className="w-16 h-16 m-auto" />
            <h1 className="text-xl mb-4">{app.name}</h1>
        </button>
    );
};

export default AppBox;


interface AppBoxProps {
    app: App;
}