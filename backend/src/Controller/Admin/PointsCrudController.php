<?php

namespace App\Controller\Admin;

use App\Entity\Points;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;


class PointsCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Points::class;
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            DateTimeField::new('timeOfGenerate', 'Created at'),

            TextEditorField::new('description'),
            TextField::new('name'),
            AssociationField::new('username')->setCrudController(Points::class)

        ];
    }

}
