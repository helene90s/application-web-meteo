import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';

//console.log("DEPUIS MAIN JS:" + tabJoursEnOrdre);

const CLEAPI = "83d730f7a4e7bb15c5abe528a70b8c20";
let resultatsAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv = document.querySelectorAll('.jour-prevision-temps');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');

if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
        //console.log(position);
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long,lat);
    }, () => {
        alert("Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer!")
    })
}

function AppelAPI(long, lat){
   // console.log(long, lat);
   // la methode fetch permet de faire une requete http pour aller prendre les donnees depuis cette API
   // template litteral $ faire une reference, mettre des expression JS dedans
   // on exclu les minutes, unité metric et langue fr
   fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEAPI}`)
   //fetch retourne une promesse, elle va se resoudre lorsque la requete sera bien effectué lorsque les données seront présentes
   .then((reponse) => {
       // on transforme la reponse qu'on reçoit au format json
       return reponse.json();
   })
   .then((data) => {
       // retourne les données
       //console.log(data);

       resultatsAPI = data;

       temps.innerText = resultatsAPI.current.weather[0].description;
       temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°` /*Math.trunc enlever les chiffres apres la virgule*/
       localisation.innerText = resultatsAPI.timezone;


       // Les heures par tranches de 3 avec leur temperature

       let heureActuelle = new Date().getHours();
       
       for(let i = 0; i < heure.length; i++) {

           let heureIncr = heureActuelle + i * 3;
            
           if(heureIncr > 24){
               heure[i].innerText = `${heureIncr - 24}`
           } else if (heureIncr === 24) {
               heure[i].innerText ="00 h"
           }else {
            heure[i].innerText = `${heureIncr} h`;
           }
       }
       
       // temperature par tranche de 3h
       for(let j = 0; j < tempPourH.length; j++) {
           tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly [j * 3].temp)}°`
       }

       // 3 premières lettres des jours

       for(let k = 0; k < tabJoursEnOrdre.length; k++) {
           joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
       }

        // Temperature par joursDiv
    
        for(let m = 0; m < 7; m++){
            tempJoursDiv[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`
        }

        // Icone dynamique 
        if(heureActuelle >= 6 && heureActuelle < 21){
            //plus de 6h et moins de 21h
            imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
        }else {
            imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
        }

        chargementContainer.classList.add('disparition');
   })
}