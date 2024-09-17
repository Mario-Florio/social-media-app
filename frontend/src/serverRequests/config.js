import populateCollections from "./mockServer/dev/populateCollections";

export let mock = false;
let clearLocalStorage = false;
let resetCollections = false;

mock && clearLocalStorage && window.localStorage.clear();
mock && resetCollections && populateCollections();