import scanner from 'sonarqube-scanner';
scanner(
    {
        serverUrl: "https://qube.acsint.io",
        //login: "",
        //login: "admin",
        //password: "admin",
        options: {
            "sonar.login": "sqp_c5bf3f60599968e2644ceb36e16846670965ceb6",
            "sonar.sources": "./src"
        },
    },
    () => process.exit()
);