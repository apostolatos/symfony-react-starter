<?php

// src/Command/CreateUserCommand.php
namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use Symfony\Component\DependencyInjection\ContainerInterface;

use App\Entity\Symbol;
use Symfony\Component\Finder\Finder;

class CreateSymbolsCommand extends Command
{
    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'app:create-symbols';

    // change these options about the file to read
    private $csvParsingOptions = array(
        'finder_in' => 'storage',
        'finder_name' => 'symbols.csv',
        'ignoreFirstLine' => true
    );

    public function __construct(ContainerInterface $container)
    {
        parent::__construct();
        $this->container = $container;
    }

    protected function configure()
    {
        $this
            // the short description shown while running "php bin/console list"
            ->setDescription('Install Symbols.')

            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('This command allows you to create seed symbols from CSV...');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $csv = $this->parseCSV();
        
        print 'Insert';

        foreach ($csv as $line) {
            $cols = explode('|', $line[0]);

            $symbol = new Symbol();
            $symbol->setSymbol($cols[0]);
            $symbol->setName($cols[1]);
            $symbol->setMarket($cols[2]);
            
            $em = $this->container->get('doctrine')->getManager();

            // tells Doctrine you want to (eventually) save the Product (no queries yet)
            $em->persist($symbol);

            $em->flush();
            print '.';
        }
        
        return 0;
    }

    /**
     * Parse a csv file
     * 
     * @return array
     */
    private function parseCSV()
    {
        $ignoreFirstLine = $this->csvParsingOptions['ignoreFirstLine'];

        $finder = new Finder();
        $finder->files()
            ->in($this->csvParsingOptions['finder_in'])
            ->name($this->csvParsingOptions['finder_name'])
        ;
        foreach ($finder as $file) { $csv = $file; }

        $rows = array();
        if (($handle = fopen($csv->getRealPath(), "r")) !== FALSE) {
            $i = 0;
            while (($data = fgetcsv($handle, null, ";")) !== FALSE) {
                $i++;
                if ($ignoreFirstLine && $i == 1) { continue; }
                $rows[] = $data;
            }
            fclose($handle);
        }

        return $rows;
    }
}