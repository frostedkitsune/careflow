import type { PrescriptionData } from '@/lib/types';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333',
    },
    header: {
        marginBottom: 30,
        textAlign: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#0056b3',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
    },
    section: {
        marginBottom: 20,
        padding: 10,
        border: '1px solid #eee',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0056b3',
        borderBottom: '1px solid #eee',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'flex-start',
    },
    label: {
        width: 100,
        fontSize: 11,
        fontWeight: 'bold',
        color: '#444',
    },
    value: {
        flex: 1,
        fontSize: 11,
        color: '#333',
    },
    multilineValue: {
        fontSize: 11,
        color: '#333',
        paddingLeft: 10,
    },
    footer: {
        marginTop: 40,
        fontSize: 15,
        textAlign: 'center',
        color: 'gray',
        borderTop: '1px solid #eee',
        paddingTop: 10,
    },
    poweredby: {
        marginTop: 45,
        fontSize: 9,
        textAlign: 'center',
        color: 'gray',
        paddingTop: 10,
    }
});

// PDF Document component
const PrescriptionPdf = ({ prescription }: { prescription: PrescriptionData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Medical Prescription</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Patient Information</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Patient Name:</Text>
                    <Text style={styles.value}>{prescription.patient.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Date of Birth:</Text>
                    <Text style={styles.value}>{new Date(prescription.patient.dob).toLocaleDateString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Gender:</Text>
                    <Text style={styles.value}>{prescription.patient.gender}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{prescription.patient.phone}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prescription Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Medication:</Text>
                    <Text style={styles.value}>{prescription.prescription.medication || 'N/A'}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Medical Observations</Text>
                <Text style={styles.multilineValue}>{prescription.prescription.observation || 'No observations noted.'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Medical Advice</Text>
                <Text style={styles.multilineValue}>{prescription.prescription.advise || 'No specific advice given.'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommended Tests</Text>
                <Text style={styles.multilineValue}>{prescription.prescription.test || 'No tests recommended.'}</Text>
            </View>

            <View style={styles.footer}>
                <Text>Prescribed on: {new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.poweredby}>
                <Text style={styles.poweredby}>Powered by careflow</Text>
            </View>
        </Page>
    </Document>
);

export const usePdfGenerator = () => {
    const generatePdf = async (prescription: PrescriptionData) => {
        const blob = await pdf(<PrescriptionPdf prescription={prescription} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `prescription_${prescription.patient.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return { generatePdf };
};