import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    selectedDateContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    selectedDateText: {
        fontSize: 18,
        color: '#333',
    },
});

export default globalStyles;

