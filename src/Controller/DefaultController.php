<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity\Symbol;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends AbstractController
{
    /**
     * @Route("/default", name="default")
     */
    public function index()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/symbol/{symbol}", name="symbol_show")
     */
    public function show($symbol)
    {   
        $symbol = $this->getDoctrine()
            ->getRepository(Symbol::class)
            ->findOneBy([
                'symbol' => $symbol
            ]);

        if (!$symbol) {
            return new Response('Not found', 404);
        }

        return new Response($symbol->getSymbol());

        // or render a template
        // in the template, print things with {{ symbol.name }}
        // return $this->render('symbol/show.html.twig', ['symbol' => $symbol]);
    }

    /**
     * @Route("/validate", name="validate")
     */
    public function validate(Request $request)
    {   
        $data = $request->request->all();
        $errors = [];

        $content = json_decode($request->getContent());

        if (! $content->symbol) {
            $errors['symbol'] = 'Symbol is required';
        } 
        else {
            $symbol = $this->getDoctrine()
                ->getRepository(Symbol::class)
                ->findOneBy([
                    'symbol' => $content->symbol
                ]);

            if (!$symbol) {
                $errors['symbol'] = 'Not valid symbol';
            }
        }

        if (! $content->startDate) {
            $errors['startDate'] = 'Start Date is required';
        }
        else {
            if (! preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $content->startDate)) {
                $errors['startDate'] = 'Start Date wrong format';
            }
        }

        if (! $content->endDate) {
            $errors['endDate'] = 'End Date is required';
        }
        else {
            if (! preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $content->endDate)) {
                $errors['endDate'] = 'End Date wrong format';
            }
        }

        if ($errors) {
            $errors['statusCode'] = 404;

            return new JsonResponse($errors, 404);
        }

        return new JsonResponse(['statusCode' => 200], 200);
    }
    
}
