<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;

class UserCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    /**
     * Configures the fields for the admin panel.
     *
     * @param string $pageName The name of the page.
     * @return iterable
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('email'),
            TextField::new('username'),
            DateTimeField::new('createdAt'),
            DateTimeField::new('updatedAt'),
            ChoiceField::new('roles')
                ->setChoices([
                    'Admin' => 'ROLE_ADMIN',
                    'User' => 'ROLE_USER',
                    'Manager' => 'ROLE_MANAGER',
                ])
                ->allowMultipleChoices()
                ->renderExpanded(false),

            AssociationField::new('points', 'Points')
                ->setFormTypeOptions([
                    'by_reference' => false,
                ]),

        ];
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->overrideTemplate('crud/edit', 'admin/edit_user.html.twig');
    }
}
