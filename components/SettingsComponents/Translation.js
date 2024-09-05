import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { addAuthor, addLanguage } from '../../store/settingsSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const Translation = ({ languages, authors }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [translationModel, setTranslationModel] = useState(false);
  const [label, setLabel] = useState([]);

  async function handleTranslationPress(translation) {
    if (translation === 'km') {
      navigation.navigate('PdfViewer', { languagePdf: 'kashmiri' });
    }
    else if (translation === 'gj') {
      navigation.navigate('PdfViewer', { languagePdf: 'gojri' });
    } else {
      setLabel([]);
      dispatch(addLanguage({ id: translation }));
      setLabel(authors[translation]);
      setTranslationModel(true);
    }
  }

  function handleRadioClick(e) {
    dispatch(addAuthor({ id: e.label }));
    setTranslationModel(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleTranslationPress(item._id)} 
            style={styles.modelButton}
          >
            <Text style={styles.text}>
              {item._id === 'hi' ? 'Hindi' : item._id === 'ur' ? 'Urdu' : item._id === 'en' ? 'English' : item._id === 'fr' ? 'Farsi' : item._id === 'km' ? 'Kashmiri' : item._id === 'gj' ? 'Gojri'  : 'Unknown'}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        numColumns={2} // Adjust to display items in 2 columns
        columnWrapperStyle={styles.row} // Add space between columns
      />

      <Modal visible={translationModel} animationType="slide" presentationStyle="pageSheet">
        {!authorLoading ? (
          <>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setTranslationModel(false)}
            >
              <Ionicons name="close-sharp" size={24} color="#333" />
            </TouchableOpacity>
            <ScrollView style={styles.modalContent}>
              <RadioButtonRN
                data={label}
                selectedBtn={(e) => handleRadioClick(e)}
                boxStyle={styles.radioBox}
                textStyle={styles.radioText}
              />
              <Text></Text>
              <Text></Text>
              <Text></Text>
            </ScrollView>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#333" />
          </View>
        )}
      </Modal>
    </View>
  );
}

export default Translation;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  modelButton: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'transparent',
    flex: 1, // Make the button take up available space
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 15,
    marginRight: 15,
    alignSelf: 'flex-end',
  },
  modalContent: {
    height: '100%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between', // Add space between columns
  },
  radioBox: {
    borderWidth: 0,
    borderRadius: 8,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F0F0F0',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
});
