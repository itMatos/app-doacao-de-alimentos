import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { StyleSheet, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EstoqueTabScreens from '@/screens/Estoque/EstoqueScreens';

export default function TabLayout() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            id="(tabs)"
            initialRouteName="Doação"
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
                name="Doação"
                component={EstoqueTabScreens}
                options={{
                    tabBarLabel: 'Doação',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="cart" size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="Estoque"
                component={EstoqueTabScreens}
                options={{
                    tabBarLabel: 'Estoque',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="warehouse" size={size} color={color} />;
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
