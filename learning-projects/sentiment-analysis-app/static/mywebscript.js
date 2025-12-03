let RunSentimentAnalysis = () => {
    const textToAnalyze = document.getElementById("textToAnalyze").value;

    if (!textToAnalyze) {
        document.getElementById("system_response").innerHTML =
            "Please enter some text first.";
        return;
    }

    const encodedText = encodeURIComponent(textToAnalyze);

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("system_response").innerHTML =
                this.responseText;
        }
    };

    xhttp.open("GET", `/sentimentAnalyzer?textToAnalyze=${encodedText}`, true);
    xhttp.send();
};
