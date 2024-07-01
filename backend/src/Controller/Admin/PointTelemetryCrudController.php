<?php

namespace App\Controller\Admin;

use App\Entity\PointTelemetry;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class PointTelemetryCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return PointTelemetry::class;
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name'),
            DateTimeField::new('timeOfGenerate'),
            BooleanField::new('isVisited'),
            BooleanField::new('generatedByRule'),
            TextEditorField::new('description'),
        ];
    }

}
