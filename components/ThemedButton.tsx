import { TouchableOpacity, type TouchableOpacityProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = TouchableOpacityProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'heading' | 'label' | 'description' | 'bannerText';
    customSize?: number;
    customColor?: string;
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'default',
    customSize,
    customColor,
    ...rest
}: ThemedButtonProps) {
    const color = customColor || useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return (
        <TouchableOpacity
            style={[
                { color, fontSize: customSize },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                type === 'heading' ? styles.heading : undefined,
                type === 'label' ? styles.label : undefined,
                type === 'description' ? styles.description : undefined,
                type === 'bannerText' ? styles.bannerText : undefined,
                style,
            ]}

            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        color: '#888',
    },
    description: {
        fontSize: 12,
        color: '#666',
    },
    bannerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
