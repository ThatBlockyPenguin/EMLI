Documentation
=============

- [Pre-Knowledge](#pre-knowledge)
- [Installation](#installation)
- [Hello, World](#hello-world)
- [Fundamentals](#fundamentals)
- [Advanced Topics](#advanced-topics)

## Pre-Knowledge
It is recommended that you have at least a basic understanding of HTML before starting with EMLI. While it is certainly possible to learn EMLI with no prior knowledge of HTML, it certainly helps. I personally recommend [Mozilla's Getting Started Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started).

You should also know the basics of how to use a terminal/command prompt. Since these vary between operating systems, I'll leave that up to you.

## Installation
To install **EMC** - the **EM**LI **C**ompiler - you firstly need to have [deno](https://deno.land) installed. You can do this by visiting their website and running the appropriate script for your system.

You then need to run `deno install --allow-read --allow-write -n emc https://cdn.jsdelivr.net/gh/ThatBlockyPenguin/WSS-EMLI@v0.1.0-alpha.3/mod.ts` to install EMC.

If you ever wish to uninstall EMC, just run `deno uninstall emc`.

To update EMC, simply uninstall it, then install it again.

To learn more about EMC, look [here](/doc/emc).

## Hello, World
To create a simple "Hello, World" file in EMLI, first create a file called 'index.emli'.

Open 'index.emli' in a text editor of your choice, and write in the following:
```
#import css '$bootstrap';

div (class: 'container') {
  h1 { 'Hello, World!' }

  hr;

  p {
    `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `
  }
}
```

Open a terminal/command prompt in the same location as the file, and run `emc`.
<br>
A file called 'index.html' should appear - open it in a web browser, and marvel at the glory.

## Fundamentals
So, what just happened there?

Well, let's start at the top.
<br>
`#import css '$bootstrap';` is a MetaCode, specifically an *import* MetaCode. All MetaCodes start with a '#'. `css` tells EMC that specifically, we are importing a CSS file. Lastly, `'$bootstrap'` is a string. You can get various types of strings, but more on that later. You can also import JavaScript files by using `#import js './path/to.js'`.

You might notice that `$bootstrap` doesn't point to a file at all. We'll learn more about this in [Advanced Topics](#advanced-topics), so for now, just take it to mean that it imports [Bootstrap CSS](https://getbootstrap.com/).

Next up, `div (class: 'container') { ... }`. This is an Element. In this case, a `div` element, which is exactly the same as from HTML. One major difference between HTML and EMLI though, is that an element's attributes are not defined like so: `<div abc="xyz">`, but instead like so: `div (abc: 'xyz')`. This means that here, we are creating a `div` element with a class of `container`. If you've used Bootstrap before, you'll know that the `container` class is used as the *"root"* of most Bootstrap webpages. Here is no different.

Following our `div`, we have a Body. Bodies are any amount of elements or strings surrounded by `{ curly braces }`. For elements that are "empty" - in other words, if they don't have a closing tag (e.g. `</div>`) - they must not have a body, instead they have a semicolon `;`. EMC will not throw an error if they have a body, but it will generate non-standard HTML, which browsers may struggle to render correctly. The Body of our `div` contains the rest of our webpage code.

Just inside it, we have `h1 { 'Hello, World!' }`. This is also the equivalent of HTML: h1 is our largest heading element. It does not have any "brackets" or "parentheses" `()` as it does not need to specify any attributes. It contains the text "Hello, World!" as a string, which will render inside the `h1` element on the webpage.

Under that, we have a `hr` element. Like the MetaCodes, our `hr` ends in a semicolon (`;`). Why? because it is one of those "empty" elements mentioned earlier. `hr` elements cannot hold any content, so they do not have a closing tag in HTML - therefore they cannot have a Body in EMLI. Appending a semicolon signals to EMC not to add a closing tag to the HTML. `hr` stands for "Horizontal Rule", so naturally, this will render a horizontal line in our webpage at this point.

Under that, we have `p { ... }`. As in HTML, `p` signifies a paragraph. Again, we don't want to specify any attributes, so we can leave out the `( ... )`. Inside the paragraph, we have a Multi-line String, containing standard "Lorem Ipsum" test text. You can read more on Multi-line strings in the next section, [Advanced Topics](#advanced-topics).

### Comments
Comments weren't utilised in the example above, but they can be very useful.
Comments can look like this:
```
// I am a comment!
```
or this:
```
/! I am also a comment!
```

The difference is, double-slash comments (`//`) will be essentially ignored by the compiler. Slashbangs (`/!`) - yes, that is a take on hashbangs - will be compiled into HTML comments. The slashbang comment above, for example, will become:
```
<!-- I am also a comment! -->
```
If you are new to programming, you may be wondering - if a comment gets ignored by the computer, than why should I use them?
<br>
Well, they can be used to document what a certain piece of code does, for example, making it easier to maintain.

## Advanced Topics
### The Technicalities of Strings
Strings can look like `"this"`, `'this'`, or ``` `this` ```. Strings that are quoted with Grave Accents (``` ` ```) are called Multi-line Strings, because they can span multiple lines. Strings can be used to specify attributes (`div (class: 'container')`), for example, or to define an import (`#import js '/assets/js/script.js'`), amongst other things. When strings are used on their own (`'Hello, World!'`), they output their contents directly to the HTML.

### Import Placeholders
You may have noticed earlier in this doc that the "Hello, World" example used '$bootstrap' as an import URL. That's because *import* MetaCodes have placeholders that can be used in place of a lengthy string. `$bootstrap` is simply a short way of requesting the [Bootstrap CSS](https://getbootstrap.com/). Currently, there are two placeholders available for CSS and two for JavaScript.

CSS has `$bootstrap`, which imports Bootstrap CSS 5.0.2, and `$w3css`, which imports w3.css.

JavaScript has `$bootstrap_bundle`, which imports the minified Bootstrap JavaScript bundle for Bootstrap 5.0.2, and `$jquery`, which imports jQuery 3.6.0.

### MetaCodes
There are more MetaCodes than just `#import`, in fact, there are currently 6!

`#import`, which we have already covered, `#title`, `#postprocessor`, `#preprocessor`, `#modify`, and `#set`.
<br>
Note that the PostProcessor and PreProcessor MetaCodes do not require a semicolon at the end, as they end with a JS code block.

#### Title
*Title* MetaCodes follow the syntax of `#title <string>;`, where `<string>` is any EMLI string. The contents of the string will be used as the title of the page.

#### PostProcessor
*PostProcessor* MetaCodes follow the syntax of `#postprocessor ~{ <javascript code> }~`, where `<javascript code>` is code, written in javascript, that will get executed after the EMLI file has been compiled. They can be used to modify the structure of the outputted HTML document. Note the tildes `~` surrounding the code block.

***NOTE: PostProcessors are not yet implemented and will have no effect!***

#### PreProcessor
*PreProcessor* MetaCodes follow the syntax of `#preprocessor ~{ <javascript code> }~`, where `<javascript code>` is code, written in javascript, that will get executed before the EMLI file has been compiled, but after the HTML template has been loaded. They can be used to modify the structure of the outputted HTML document. Note the tildes `~` surrounding the code block.

***NOTE: PreProcessors are not yet implemented and will have no effect!***

#### Modify
*Modification* MetaCodes follow the syntax of `#modify <properties>;`, where `<properties>` is a list of properties, like that used in an Element. They can be used to modify the configuration variables for a specific file, which are outputted at various stages throughout the compilation process.

#### Set
<span style="color:red;">**UNSTABLE**</span><br>
<span style="filter:brightness(135%);">*Set* MetaCodes are unstable, meaning that they may be deprecated at any time! Once a feature is deprecated, it is most likely going to be removed in a future update.</span>

*Set* MetaCodes allow the setting of pre-defined elements to variables, which can be used in strings. For example:
```
#set my-link = a(href: 'my.cool.site') { 'My Cool Site' };

p {
  'Come check out $my-link$!'
}
```

Would give the same result as:

```
p {
  'Come check out ' a(href: 'my.cool.site') { 'My Cool Site' } '!'
}
```

*Set* MetaCodes require a semicolon on the end, even if the element you are setting ends in a semicolon.
<br>
This is valid:
<br>
`#set line = hr;;`
<br>
This is not:
<br>
`#set line = hr;`
