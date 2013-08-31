
Vroom
=====

> **WARNING:**
> This project is under development right now, and nothing might work yet.
> Suggestions and ideas are always welcome though.


***Vroom*** wants to be a developing tool for multi-platform HTML5 applications (android, ios, web apps).

It is a nodejs web server that will package everything at the end ready to be served with a static web server or bundled in a container like PhoneGap.


Planned features
-----------------

### Rules

#### Platform rules

Only one of the platforms will be enabled at once.

```
// A version of the application will be built for every platform
vroom.platforms = ['android', 'ios', 'web', 'chromeapp'];

// In development mode, these rules will detect the platform.
vroom.development.platforms = {
    'android': function(req) { req.headers['user-agent'].match(/android/); },
    'ios': function(req) { req.headers['user-agent'].match(/ios/); }
    'chromeapp': function(req) { req.path.match(/#chromeapp/); }
    'web': 'default'
};
```

#### Runtime rules

These rules are evaluated at runtime.

```
vroom.rules = {
    '2x':   function() { return window.devicePixelRatio == 2; }

    // platform based
    'ios:small': function() { return device.platform.match(/iPhone/); }
    'ios:large': function() { return device.platform.match(/iPad/); }
    'android:small': function() { return screen.width / window.devicePixelRatio < 640; }

    // regex
    /[a-z]{2}/: function(lang) { return app.locale == lang; }
}
```

#### Rules and CSS

All rules are automatically mapped to a CSS class with the same name.
    
    vroom.classMap = {
        /* rename selector: 
           `app` css class is mapped to `chromeapp` rule. */
        'app': 'chromeapp',   

        /* advanced mapping */
        'not-web': ':not(.web)' 
    };


### Rule based file overloading and merging.

When a resource is requested, the server will choose the resource(s) that best match the current rules. 

```
logo.png            // default
logo-@2x.png        // retina
logo-@small.png     // a small variant
locale.json
locale-fr.json
```

If **multiple resources** are matched, the most specific will be used.

```
logo-@small-@2x.png // retina and small variant
```

Prefered matching order can be specified with `@digit`:

```
index-@1-@small.html
index-@2-@large.html
index-@3-@web.html
```

In the case of **CSS**, multiple matched resources can be concatenated using `+`:

```
app.css
app+@ios.css
todo.css
todo+@large.css
```

### Features *(as modules)*

In the context of the rules described above, a modularization of the application by rules is useful. Here is where *features* come into play.

An application is described as a collection of **features**, and all the scripts, html templates, css styles are local to features.

```
features/
    $app
        index.html
        main.css
```

#### Main feature ####

The `$app` is the first feature *loaded*:

* `$app/index.html` (and rule variants) is the main index.

#### Auto loading ####

Features prepended with a `$` are automatically *loaded*:

* scripts prepended with `$` are loaded automatically.

This allows rule based auto loading:

```
$touchEvents-@touch/
    $touchEvents.js
    $scrolling-@ios.js
```



- - - 


### CSS class isolation

CSS loaded on request can be wrapped and prefixed:

```
var css = requireCSS("todo", {
    wrap: '.view-todos', 
    prefix: 'todo-'
});
```

### Class obfuscation

All the class names will be obfuscated at packaging time. This applies in HTML templates and CSS styles. 

To get renamed class names, use this pattern:

```
var css = requireCSS("todo");
$(css('.profile')).addClass(css('active'));
```

Css class names are renamed by default in development mode to reduce renaming issues.
See [development mode section](#development-mode) for more info.

- - -

### HTML templates

#### Nesting

```
<include src="nested.html"/>
```

This is especially useful considering that `nested.html` can be overloaded based on rules.

#### Clean other platform classes.

If the current platform is `android`:

```html
<div class="header">
    <div class="android action-bar"> ... </div>
    <!-- <div class="ios ios-bar"> ... </div>    removed -->
    <!-- <div class="web"> ... </div>            removed -->
</div>
```

### Opinionated

 * **[Less](http://lesscss.org)** is used for CSS parsing. 
 * The html templates are parsed and reconstructed using **[cheerio](http://matthewmueller.github.io/cheerio/)**. Invalid HTML will cause issues.
 * **[requirejs](http://requirejs.org)** is used for modularization and optimization (r.js). 
 * intended for using with **[PhoneGap](http://phonegap.com)**

### Packaging

> <font color="#0a0">TODO: complete specifications.</font>

- one app per platform will be generated

- custom sets:
    - ios+en+small

### Development mode

- `dev` rule is declared automatically in development mode.
    - That means: `$-@dev` features are loaded automatically in development mode.
- css classes are prefixed to `x--`.

* * *


Getting started
---------------

1. Yeoman scaffolding:

        > npm install yo vroom-generator
        > yo vroom


2. Start the development server with:

        > vroom dev


3. Package the app with:

        > vroom build





* * *
* * *
* * *

## Url mapping
```
features/$app/index.html -> /
features/$app/style.less -> /style.css
features/$app/style-@ios.less -> /style.css (merged)
```

## Packaging
`> vroom build android ios web web:chromeapp`
```
dist\
    android\
    ios\
    web\
        5499a05a37e57947b87f176f2d5a21df.app.js     - app.js
        007ccaa83aa7674f1166352c3605b85c.module1.js
        f9cce95db5c816a935906a713c78aff5.module2.js
        9cfefed8fb9497baa5cd519d7d2bb5d7.locale.js  - locale
        82a9e4d26595c87ab6e442391d8c5bba.locale.js  - locale-@fr
        index.html
        robots.txt
        favion.ico
    web:chromeapp\
        adbf5a778175ee757c34d0eba4e932bc.app.js     - app-@chromeapp.js
        007ccaa83aa7674f1166352c3605b85c.module1.js
        f9cce95db5c816a935906a713c78aff5.module2.js
        9cfefed8fb9497baa5cd519d7d2bb5d7.locale.js  - locale
        82a9e4d26595c87ab6e442391d8c5bba.locale.js  - locale-@fr
        index.html
        icon-64.png
        icon-128.png

```

* * *
# TODO: #
- url mapping

- feature dependencies

- dynamic rules static packaging?
    1. generated in a permutation
    2. css rules
