import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { addTafseer } from '../../store/settingsSlice';

const TafseerText = ({ textStyle, title }) => {
  const dispatch = useDispatch();
  const [textModelOpen, setTextModelOpen] = useState(false);

  function handleRadioClick(e) {
    dispatch(addTafseer({ id: e.label }));
    setTextModelOpen(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.modelButton} onPress={() => setTextModelOpen(true)}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
      <Modal visible={textModelOpen} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setTextModelOpen(false)}>
            <Ionicons name="close-sharp" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <RadioButtonRN
            data={textStyle}
            selectedBtn={(e) => handleRadioClick(e)}
            boxStyle={styles.radioBox}
            textStyle={styles.radioText}
          />
          <Text></Text>
          <Text></Text>
          <Text></Text>
        </ScrollView>
      </Modal>
    </View>
  );
}

export default TafseerText;

const styles = StyleSheet.create({
  container: {
    
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  modelButton: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'transparent',
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
  },
  modalContent: {
    padding: 20,
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
