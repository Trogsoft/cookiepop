# cookiepop

This is our simple cookie consent system.  Add this to your HTML.

```html
<script src="/js/trogsoft.cookiepop.global.min.js"></script>
<link rel="stylesheet" href="/css/trogsoft.cookiepop.min.css" />
```

That's it!  

The `.global.min.js` file includes all languages.  Alternatively if you only need one language, choose the specific file, for example

`trogsoft.cookiepop.{lang}.min.js`

## Configuration

To configure this, add another script block as shown below.

```html
<script src="/js/trogsoft.cookiepop.global.min.js"></script>
<script>
    cookiepop.configure({
        cookieName: '_cp_cookie_preference', // optionally configure the cookie name
        cookiePath: '/', // optionally configure the cookie path
        expiry: 31536000, // optionally configure the cookie expiry - defaults to one year
        autoDetectCookieTypes: true, // auto-detect the types of cookie the user can consent to, see below
        cookiesUsed: ['required','functional','stats','marketing'], // manually specify the cookie types the user can consent to, overwritten if autoDetectCookieTypes is true
        lang: 'en' // specify the language you want to use.
    });
</script>
```

## Scripts that Set Cookies

If you have scripts that set cookies, you can have these deferred until the user provides consent.  If, for example, you have a Google Adsense script, place it into a file and refer to it like this:

```html
<x-script src="/js/google-ads.js" cookie-type="marketing"></x-script>
```

When the user provides consent for marketing cookies, the tag will be automatically changed and the script will run.

This is also how cookie type auto-detection works.  Each of the cookie types you specify using the above markup will be offered to the user for consent.

Valid cookie types are:

* `required` (consent for these cannot be withdrawn)
* `functional`
* `stats` (eg, Google Analytics)
* `marketing` (eg, Google Adsense)

## Events

When the user provides consent, you can react to it.

```js
cookiepop.on('consent', function(cookieTypes){
    console.log('You consented to the following cookies: '+cookieTypes);
});
```

## Styling

If you want to alter the colors or styles, you will have to do this with your own CSS for the time being.  Look in trogsoft.cookiepop.scss to see what to override.

## Translations

If you are able to provide translations, check out the `src/lang/lang.en.js` file.  This contains all the strings that need translating.  Feel free to submit a pull request to have it included in the project.  Our thanks in advance!

## Manually triggering the Customize Popup

Use something like this on your page:

```html
<button class="cookie-preferences">Change My Preferences</button>
```

Or do it manually with Javascript.

```js
...
cookiepop.configurePreferences();
...
```

## Roadmap

* Make language detection automatic
* Allow user to select a language in the UI
* User refines consent to make it more restrictive, something should happen
* Style using configuration
* Make it mobile friendly
* Different positions for the popup
* Test on different browsers
