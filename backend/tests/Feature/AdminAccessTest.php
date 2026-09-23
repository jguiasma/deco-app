<?php

it('refuse l accès au dashboard admin sans token', function () {
    $this->getJson('/api/admin/dashboard')
        ->assertUnauthorized();
});