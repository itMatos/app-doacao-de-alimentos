import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { Chip, Icon } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const DeletingChip = ({ isDeleting}: {isDeleting: boolean}) => {
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isDeleting) {
            // Iniciar a animação de rotação
            Animated.loop(
                Animated.timing(rotateValue, {
                    toValue: 1,
                    duration: 2000, // Duração de 1 segundo para a rotação
                    easing: Easing.linear, // Animação contínua e linear
                    useNativeDriver: true, // Melhor desempenho
                })
            ).start();
        } else {
            // Parar a animação
            rotateValue.stopAnimation();
        }
    }, [isDeleting]);

    // Converter o valor de rotação para uma string transformável
    const rotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'], // Roda de 0 a 360 graus
    });

    return (
        <Chip
            icon={() => (
                <Animated.View style={{ transform: [{ rotate }] }}>
					<Icon source="dots-circle" size={20} color="gray" />
                </Animated.View>
            )}
        >
            Excluindo...
        </Chip>
    );
};

export default DeletingChip;
