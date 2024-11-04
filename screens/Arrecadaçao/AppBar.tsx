import * as React from 'react';
import { Appbar } from 'react-native-paper';

export default function AppBarTeste() {
    return (
        <>
            <Appbar.Header mode="center-aligned">
                <Appbar.Content title="Arrecadação" />
            </Appbar.Header>
        </>
    );
}
