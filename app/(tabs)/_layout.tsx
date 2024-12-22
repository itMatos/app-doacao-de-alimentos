import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, TouchableRipple } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EstoqueTabScreens from '@/screens/Produtos/EstoqueScreens';
import ArrecadacaoTab from '@/screens/Arrecadaçao/ArrecadacaoTab';
import ProdutosTab from '@/screens/Produtos/ProdutosTab';
import CampanhasTab from '@/screens/Campanhas/CampanhasTab';

export default function TabLayout() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            key="(tabs)"
            initialRouteName="Arrecadação"
            screenOptions={{
                headerShown: false,
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (event.defaultPrevented) {
                            preventDefault();
                        } else {
                            navigation.dispatch({
                                ...CommonActions.navigate(route.name, route.params),
                                target: state.key,
                            });
                        }
                    }}
                    renderIcon={({ route, focused, color }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarIcon) {
                            return options.tabBarIcon({ focused, color, size: 24 });
                        }

                        return null;
                    }}
                    renderTouchable={({ key, ...props }) => (
                        <TouchableRipple key={key} {...props} />
                    )}
                    getLabelText={({ route }) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                ? options.title
                                : route.key;

                        return label.toString();
                    }}
                />
            )}
        >
            <Tab.Screen
                name="Arrecadação"
                component={ArrecadacaoTab}
                options={{
                    tabBarLabel: 'Arrecadação',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="hand-heart" size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="Campanhas"
                component={CampanhasTab}
                options={{
                    tabBarLabel: 'Campanhas',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="account-group" size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="Produtos"
                component={ProdutosTab}
                options={{
                    tabBarLabel: 'Produtos',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="view-list-outline" size={size} color={color} />;
                    },
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
