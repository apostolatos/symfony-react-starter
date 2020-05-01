# Symfony React Starter

First of all we need to clone project:

`git clone https://github.com/apostolatos/symfony-react-starter.git`

A folder `\symfony-react-starter` is now created.

`cd symfony-react-starter`

Then install our dependencies:

`composer install`

Install the following module:

`npm install webpack-dev-server --save-dev`

And run the following in your terminal/console:

`npm run dev`

Now, we need to create a database which is named `prices`

Copy **.env.example**

Change the name with .env and make your own settings in .env file.

* DATABASE_URL=mysql://{username}:{password}@127.0.0.1:3306/{database}?serverVersion=5.7 *

Once the database is created, run the following console command to install tables.

`php bin/console make:migration`

Our database is all set!

Now run the database seeder to import Company Symbols in the symbols table:

`php bin/console app:create-symbols`

# Run

`php -S 127.0.0.1:8000 -t public`

# Testing

Run the following command for unit testing

php bin/phpunit