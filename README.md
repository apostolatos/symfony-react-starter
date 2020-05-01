# symfony-react-starter

Clone project:

`git clone https://github.com/apostolatos/symfony-react-starter.git`

After that a folder `symfony-react-starter` is created.

`cd symfony-react-starter`

First of all, we install our dependencies:

`composer install`

Install the following module:

`npm install webpack-dev-server --save-dev`

And run the following in your terminal/console:

`npm run dev`

Now, we need to create a database which is named `prices`

Once the database is created, run the following URL command to install tables and seeder.

`php bin/console make:migration`

Our database is all set!

Copy **.env.example**

Change the name with .env

Make your own settings in .env file.

* DATABASE_URL=mysql://{username}:{password}@127.0.0.1:3306/{database}?serverVersion=5.7 *

Run datatbase seeder to import symbols in a table:

`php bin/console app:create-symbols`

# Run

`php -S 127.0.0.1:8000 -t public`

# Testing

Run the following command for unit testing

php bin/phpunit