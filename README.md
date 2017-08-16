# firebase-rules-describe

Generate complex `database.rules.json` files with ease. With this package you can describe your Firebase rules in your 
native language and split the definitions in multiple files.

## Basic usage

Install globally with `npm install firebase-rules-describe -g`

Create a file containing the definitions of your rules: `database.definitions.json`

```json
{
  "rules": {
    "example": {
      ".read": "{Authenticated User}",
      ".write": "{User is Admin}",
      ".validate": "{Hello World}"
    }
  }
}
```

Create a file containing the specs for the definitions: `database.specs.json`

```json
{
  "Authenticated User": "auth !== null",
  "User is Admin": "root.child('admins/' + auth.uid).val() === true",
  "Hello World": "newData.val() === 'Hello World'"
}
```

Run the following command to process these files into an output file:

`firebase-rules-describe process database.definitions.json database.specs.json database.rules.json` 

These filenames are the defaults, so you can ommit them:

`firebase-rules-describe process`

Output will be a file: `database.rules.json`

```json
{
  "rules": {
    "example": {
      ".read": "auth !== null",
      ".write": "root.child('admins/' + auth.uid).val() === true",
      ".validate": "newData.val() === 'Hello World'"
    }
  }
}
```

## Features

### Comments

Both in the definitions and spec files, you can include comments. These will not be included in the rules output file.

### Definitions within Specs

You can create more complex Specs by including definitions in the Specs. For example consider the following Spec file:

```json
{
  // Authentication
  "Admin": "root.child('admins/' + auth.uid).val() === true",
  
  // Posts
  "Post creator": "root.child('posts/' + $post_id + '/creator').val() === auth.uid",
  "Global editor": "auth.uid === 'global-editor'",
  "Post editor": "{Admin} || {Post creator} || {Global editor}"
}
```

This allows you to specify in your rules definitions, that any `{Post editor}` can write to a post. This includes the
post creator, the admin and a global editor. Note that the `$post_id` wildcard variable is used in the spec in order to determine
the post creator.

```json
{
  "rules": {
    "posts": {
      // Rules for every Post
      "$post_id": {
        ".write": "{Post editor}"
      }
    }
  }
}
```

### Split files

Your rules definitions file can be split in different files. Use `[filename.json]` to include a file at that location. 
Use the `key` at that location as the root `key` in the new file.

`database.definitions.json`
```json
{
  "rules": {
    "posts": "[posts.json]",
    "users": "[users.json]"
  }
}
```

`posts.json`
```json
{
  "posts": {
    "$post_id": {
      // Post rules
    }
  }
}
```

`users.json`
```json
{
  "users": {
    "$user_id": {
      // User rules
    }
  }
}
```