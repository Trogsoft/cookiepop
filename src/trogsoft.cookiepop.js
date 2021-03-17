const cookiepop = new function () {

    const cp = this;
    const pendingScripts = [];
    const defaults = {
        cookieName: '_cp_cookie_preference'
    };

    const eventHandlers = {
        'consent': []
    }

    const defaultResources = {
    };

    let settings = Object.assign({}, defaults);
    let resources = Object.assign({}, defaultResources);

    cp.lang = function (lang) {
        resources = Object.assign({}, defaultResources, lang);
    }

    cp.on = function (eventName, handler) {
        eventHandlers[eventName].push(handler);
    }

    cp.configure = function (config) {
        settings = Object.assign({}, defaults, config);
    }

    cp.init = function () {
        document.querySelectorAll('x-script').forEach(x => pendingScripts.push(x));
        const matchingCookies = document.cookie.split(';').filter(x => x.startsWith(settings.cookieName + '='));
        if (matchingCookies.length > 0)
            applyPreference();
        else
            cp.showCookiePopup();
    }

    function applyPreference(pref) {

        eventHandlers.consent.forEach(x => x(pref));
        document.querySelector('.cp-popup').remove();

        pendingScripts.forEach(x => {
            let scriptNode = document.createElement('script');
            Array.from(x.attributes).forEach(a => scriptNode.setAttribute(a.name, a.value));
            x.insertAdjacentElement('beforebegin', scriptNode);
            x.remove();
        });

    }

    cp.showCookiePopup = function () {

        const popupElement = document.createElement('div');
        popupElement.className = 'cp-popup';

        if (resources.popupTitle) {
            const popupTitle = document.createElement('p');
            popupTitle.className = 'cp-title';
            popupTitle.innerText = resources.popupTitle;
            popupElement.appendChild(popupTitle);
        }

        const popupText = document.createElement('p');
        popupText.className = 'cp-text';
        popupText.innerText = resources.popupText;
        popupElement.appendChild(popupText);

        const popupButtons = document.createElement('div');
        popupButtons.className = 'cp-buttons';
        popupElement.appendChild(popupButtons);

        const popupOk = document.createElement('button');
        popupOk.className = 'cp-button cp-accept';
        popupOk.innerText = resources.popupOk;
        popupButtons.appendChild(popupOk);

        const popupCustomize = document.createElement('button');
        popupCustomize.className = 'cp-button cp-customize';
        popupCustomize.innerText = resources.popupCustomize;
        popupButtons.appendChild(popupCustomize);

        popupOk.addEventListener('click', e => { applyPreference('all') });
        document.querySelector('body').appendChild(popupElement);

    }

    document.addEventListener('readystatechange', function () {
        if (document.readyState == 'complete') {
            cp.init();
        }
    });

    return cp;

}
