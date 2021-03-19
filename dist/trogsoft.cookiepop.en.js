const cookiepop = new function () {

    const cp = this;
    const pendingScripts = [];
    const defaults = {
        cookieName: '_cp_cookie_preference',
        cookiePath: '/',
        expiry: 31536000,
        autoDetectCookieTypes: true,
        cookiesUsed: ['required', 'functional', 'stats', 'marketing'],
        lang: 'en'
    };

    const eventHandlers = {
        'consent': []
    }

    const languageStrings = {
    };

    let settings = Object.assign({}, defaults);

    function getString(loc) {
        return loc(languageStrings[settings.lang]);
    }

    cp.lang = function (lang, resources) {
        languageStrings[lang] = resources;
    }

    cp.on = function (eventName, handler) {
        eventHandlers[eventName].push(handler);
    }

    cp.configure = function (config) {
        settings = Object.assign({}, defaults, config);
    }

    function getCookieValue() {
        const matchingCookies = document.cookie.split(';').filter(x => x.trim().startsWith(settings.cookieName + '='));
        if (matchingCookies.length > 0) {
            const [_, val] = matchingCookies[0].split('=');
            return val;
        }
        return undefined;
    }

    cp.init = function () {
        if (settings.autoDetectCookieTypes)
            settings.cookiesUsed = ['required'];

        document.querySelectorAll('x-script').forEach(x => {
            if (settings.autoDetectCookieTypes) {
                var cookieType = x.getAttribute('cookie-type');
                if (settings.cookiesUsed.indexOf(cookieType) === -1)
                    settings.cookiesUsed.push(cookieType);
            }
            pendingScripts.push(x)
        });
        document.querySelector('.cookie-preferences').addEventListener('click', cp.configurePreferences);

        var cookieValue = getCookieValue();
        if (typeof cookieValue == "undefined") {
            cp.showCookiePopup();
        } else {
            applyPreference(cookieValue);
        }
    }

    function applyPreference(pref) {

        eventHandlers.consent.forEach(x => x(pref));

        var oldPreference = getCookieValue() || '';
        var oldValues = oldPreference.split(',');

        var popup = document.querySelector('.cp-popup');
        if (popup)
            popup.remove();

        var splitPrefs = pref.split(',');

        pendingScripts.forEach(x => {

            var cp = x.getAttribute('cookie-type');
            if (splitPrefs.indexOf(cp) > -1 || pref === 'all') {
                let scriptNode = document.createElement('script');
                Array.from(x.attributes).forEach(a => scriptNode.setAttribute(a.name, a.value));
                x.insertAdjacentElement('beforebegin', scriptNode);
                x.remove();
            }

        });

        setCookie(pref);

    }

    cp.showCookiePopup = function () {

        const popupElement = document.createElement('div');
        popupElement.className = 'cp-popup';

        const popupText = document.createElement('p');
        popupText.className = 'cp-text';
        popupText.innerText = getString(x => x.popupText);
        popupElement.appendChild(popupText);

        const popupButtons = document.createElement('div');
        popupButtons.className = 'cp-buttons';
        popupElement.appendChild(popupButtons);

        const popupOk = document.createElement('button');
        popupOk.className = 'cp-button cp-accept';
        popupOk.innerText = getString(x => x.popupOk);
        popupButtons.appendChild(popupOk);

        const popupCustomize = document.createElement('button');
        popupCustomize.className = 'cp-button cp-customize';
        popupCustomize.innerText = getString(x => x.popupCustomize);
        popupButtons.appendChild(popupCustomize);

        popupOk.addEventListener('click', e => { setCookie('all'); applyPreference('all') });
        popupCustomize.addEventListener('click', cp.configurePreferences);
        document.querySelector('body').appendChild(popupElement);

    }

    cp.configurePreferences = function () {

        var cookieVal = getCookieValue() || '';
        var allowed = cookieVal.split(',');

        const prefOverlay = document.createElement('div');
        prefOverlay.className = 'cp-pref-overlay';
        document.querySelector('body').appendChild(prefOverlay);

        const prefPop = document.createElement('div');
        prefPop.className = 'cp-pref';

        const prefContent = document.createElement('div');
        prefContent.className = 'cp-pref-content';
        prefPop.appendChild(prefContent);

        const prefContentHead = document.createElement('h1');
        prefContentHead.innerText = getString(x => x.custTitle);
        prefContent.appendChild(prefContentHead);

        const prefContentIntro = document.createElement('p');
        prefContentIntro.innerText = getString(x => x.custHeader);
        prefContent.appendChild(prefContentIntro);

        settings.cookiesUsed.forEach(x => {

            const cookieType = document.createElement('div');
            cookieType.className = 'cp-pref-cookie-type cp-cookie-' + x;

            const cookieTypeCheckbox = document.createElement('input');
            cookieTypeCheckbox.type = 'checkbox';
            cookieTypeCheckbox.id = 'cookie-type-' + x;

            if (x === 'required') {
                cookieTypeCheckbox.disabled = true;
                cookieTypeCheckbox.checked = true;
            }

            if (allowed.indexOf(x) > -1 || cookieVal == 'all')
                cookieTypeCheckbox.checked = true;

            cookieType.appendChild(cookieTypeCheckbox);

            const cookieTypeLabel = document.createElement('label');
            cookieTypeLabel.setAttribute('for', cookieTypeCheckbox.id);
            cookieTypeLabel.innerText = getString(l => l.cookieType[x].title);
            cookieType.appendChild(cookieTypeLabel);

            const cookieTypeDesc = document.createElement('p');
            cookieTypeDesc.innerText = getString(l => l.cookieType[x].description);
            cookieType.appendChild(cookieTypeDesc);

            prefContent.appendChild(cookieType);

        });

        const prefButton = document.createElement('button');
        prefButton.className = 'cp-button cp-pref-button';
        prefButton.innerText = getString(l => l.custButtonAccept);
        prefPop.appendChild(prefButton);

        prefButton.addEventListener('click', determineSelectedPreferences);

        document.querySelector('body').appendChild(prefPop);

    }

    function determineSelectedPreferences() {

        const accepted = [];
        settings.cookiesUsed.forEach(x => {
            var checkboxId = '#cookie-type-' + x;
            var checkbox = document.querySelector(checkboxId);
            if (checkbox.checked) {
                accepted.push(x);
            }
        });

        const acceptedString = accepted.join(',');

        let overlay = document.querySelector('.cp-pref-overlay');
        overlay.remove();

        let prefPopup = document.querySelector('.cp-pref');
        prefPopup.remove();

        applyPreference(acceptedString);

    }

    function setCookie(pref) {

        document.cookie = settings.cookieName + '=' + pref + '; max-age=' + (settings.expiry) + '; path=' + settings.cookiePath;

    }

    document.addEventListener('readystatechange', function () {
        if (document.readyState == 'complete') {
            cp.init();
        }
    });

    return cp;

}



cookiepop.lang('en', {
    popupTitle: '',
    popupText: 'This website uses cookies to ensure you get the best experience.',
    popupOk: 'Accept All',
    popupCustomize: 'Customize',
    custTitle: 'Customize Cookies',
    custButtonAccept: 'Accept Selected',
    custHeader: 'The following types of cookies are used on this site.  Please select which you want to accept.',
    cookieType: {
        'required': { title: 'Required Cookies', description: 'These cookies are necessary for the site to function and typically include cookies to track a login status or session state.' },
        'functional': { title: 'Functionality Cookies', description: 'These cookies are required to provide certain optional functionality and may be turned off at the cost of losing this functionality.' },
        'stats': { title: 'Statistical Cookies', description: 'Statistical cookies are typically served by third parties and intended to provide the site owner with information about who is accessing the website, and how.' },
        'marketing': { title: 'Marketing Cookies', description: 'Marketing or advertising cookies are typically served by third parties and may track you across multiple websites for the purpose of tailoring advertising to your interests.' }
    }
});
