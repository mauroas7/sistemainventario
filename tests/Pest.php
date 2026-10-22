<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/*
 * `RefreshDatabase` para todo `Feature`: la base sqlite en memoria de
 * `phpunit.xml` se migra una vez por test y no queda estado entre ellos.
 * Una llamada HTTP sin `Http::fake` que la responda hace fallar el test.
 */
uses(TestCase::class, RefreshDatabase::class)
    ->beforeEach(fn () => Http::preventStrayRequests())
    ->in('Feature');
