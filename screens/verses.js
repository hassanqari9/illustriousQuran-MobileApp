import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
// import * as SQLite from 'expo-sqlite';
// import { LinearGradient } from 'expo-linear-gradient';

import mosque from '../assets/mosque.png';
import axios from 'axios';

const Verses = ({ route, navigation }) => {
  const arabicText = useSelector((state) => state.settings.arabicText);
  const language = useSelector((state) => state.settings.language);
  const author = useSelector((state) => state.settings.author);
  const fontSize = useSelector(state => state.settings.fontSize);
  const tafseer = useSelector(state => state.settings.tafseer);

  const { surah } = route.params;
  const { surahVerseData } = route.params;
  const [verses, setVerses] = useState([]);
  const [translationsArray, setTranslationsArray] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState();
  const [playing, setPlaying] = useState(false);
  const [soundObject, setSound] = useState(new Audio.Sound());
  const [summary, setSummary] = useState('')
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [surahTafseer, setSurahTafseer] = useState([]);
  const [verseTafseer, setVerseTafseer] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  // console.log(surahVerseData.verses[0].translations);
  // console.log(author);
  // console.log(language);

  async function handleSummarization() {
    setSummarizeLoading(true);

    console.log('Starting to summarize');
    let concatenatedTranslations = ''
    if (translationsArray.length === 0) {
      concatenatedTranslations = verses.map(verse => verse.data.translation).join(' ');
    } else {
      concatenatedTranslations = translationsArray.map(trans => trans.translation).join(' ');
    }

    // console.log(surah.name);
    // console.log(concatenatedTranslations);
    if (concatenatedTranslations !== '') {

      try {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/summarize`, // Replace with your backend URL
          {
            surahName: surah.name,
            text: concatenatedTranslations,
            language: language,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        console.log(response.data.summary);
        setSummary(response.data.summary);
        setModalVisible(true)
      } catch (error) {
        console.error("Error fetching summary:", error);
        Alert.alert("Model Overloaded !", "Please check your internet conncetion or try again later", [{ text: "Okay" }]);
      } finally {
        setSummarizeLoading(false);
      }
    }
  }

  useEffect(() => {
    //   console.log('useEffect1');
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSummarization} style={styles.summarizeButton}>
          <Text style={styles.summarizeButtonText}>
            {!summarizeLoading ? <Ionicons name="reader-sharp" color='#5523A2' size={25}></Ionicons> : <Ionicons name="reader-sharp" color='#5523A2' size={25}></Ionicons>}
          </Text>
        </TouchableOpacity>
      ),
    })
  })

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // console.log("Surah: ", surah);
  // console.log("SurahVerseData: ", surahVerseData.verses);

  // const initDB = async (surahName) => {
  //   const db = await SQLite.openDatabaseAsync(`${surahName}.db`, {
  //     useNewConnection: true
  //   });
  //   await db.execAsync(
  //     `CREATE TABLE IF NOT EXISTS Surahs (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       chapter INTEGER,
  //       verse INTEGER,
  //       simple TEXT,
  //       simpleClean TEXT,
  //       simplePlain TEXT,
  //       simpleMinimal TEXT,
  //       uthmani TEXT,
  //       uthmaniMinimal TEXT
  //     );`
  //   );
  //   await db.execAsync(
  //     `CREATE TABLE IF NOT EXISTS Translations (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       surah_id INTEGER,
  //       language TEXT,
  //       author TEXT,
  //       translation TEXT,
  //       FOREIGN KEY (surah_id) REFERENCES Surahs(id)
  //     );`
  //   );
  //   return db;
  // };

  // const insertSurah = async (db, surahVerses) => {
  //   console.log('inserting surah');
  //   await db.execAsync('DELETE FROM Surahs');
  //   await db.execAsync('DELETE FROM Translations');
  //   try {
  //     for (const surahVerse of surahVerses) {
  //       const result = await db.runAsync(
  //         `INSERT INTO Surahs (chapter, verse, simple, simpleClean, simplePlain, simpleMinimal, uthmani, uthmaniMinimal) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
  //         [
  //           surahVerse.chapter,
  //           surahVerse.verse,
  //           surahVerse.text.simple,
  //           surahVerse.text.simpleClean,
  //           surahVerse.text.simplePlain,
  //           surahVerse.text.simpleMinimal,
  //           surahVerse.text.uthmani,
  //           surahVerse.text.uthmaniMinimal
  //         ]
  //       );
  //       const surahId = result.lastInsertRowId;
  //       for (const translation of surahVerse.translations) {
  //         await db.runAsync(
  //           `INSERT INTO Translations (surah_id, language, author, translation) VALUES (?, ?, ?, ?);`,
  //           [surahId, translation.language, translation.author, translation.translation]
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error inserting Surah and translations:', error);
  //     throw error;
  //   }
  //   console.log('inserting surah finished');

  // };

  // const fetchSurahVerses = async (db) => {
  //   try {
  //     const results = await db.getAllAsync(`SELECT * FROM Surahs`);
  //     return results;
  //   } catch (error) {
  //     console.error('Error fetching Surah verses:', error);
  //     throw error;
  //   }
  // };

  // const fetchTranslations = async (db) => {
  //   try {
  //     const results = await db.getAllAsync(
  //       `SELECT * FROM Translations WHERE author = ? AND language = ?`,
  //       [author, language]
  //     );
  //     return results;
  //   } catch (error) {
  //     console.error('Error fetching translations:', error);
  //     throw error;
  //   }
  // };

  // const fetchSurahData = async () => {
  //   console.log("fetchVerses&TranslationsFromApi");

  //   try {
  //     // const response = await fetch(`http://192.168.29.253:3000/v1/scripture/quraan/search/${surah.chapter}`);
  //     const response = await fetch(`https://illustriousquran-backend.onrender.com/v1/scripture/quraan/search/${surah.chapter}`);
  //     const data = await response.json();
  //     data?.data.sort((a, b) => a.verse - b.verse);
  //     // console.log("Verses&Translations: ", data?.data);
  //     return data?.data;
  //   } catch (error) {
  //     console.error("Error fetching surah data:", error);
  //     throw error;
  //   }
  // };

  const fetchSurahInfo = async () => {
    console.log(process.env.EXPO_PUBLIC_API_URL);
    
    console.log('fetchSurahInfo');
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/v1/scripture/quraan/get?language=${language}&chapter=${Number(surah.chapter)}&author=${author}&text=${arabicText}`)
        .then((response) => response.json())
        .then((data) => {
          data.data.sort((a, b) => a.verse - b.verse);
          setVerses(data?.data);
        })
        .catch((error) =>
          console.error("Error fetching verses for surah:", error)
        );
    } catch (error) {
      console.error("Error fetching audio data:", error);
      throw error;
    }
  };

  const fetchAudioData = async () => {
    console.log("fetchAudioDataFromApi");
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.chapter}/ar.abdulbasitmurattal`);
      const data = await response.json();
      // console.log("Audios: ", data?.data);
      return data.data.ayahs;
    } catch (error) {
      console.error("Error fetching audio data:", error);
      throw error;
    }
  };

  const fetchSurahTafseer = async () => {
    console.log("fetchSurahTafseer");

    try {
      const response = await fetch(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${tafseer}/${surah.chapter}.json`);
      const data = await response.json();
      // console.log("Tafseer: ", data.ayahs.sort((a, b) => a.ayah - b.ayah));
      data.ayahs.sort((a, b) => a.ayah - b.ayah)
      setSurahTafseer(data.ayahs);
    } catch (error) {
      console.error("Error fetching tafseer data:", error);
      throw error;
    }
  };


  useEffect(() => {
    console.log('useEffect2');
    const initialize = async () => {

      // setLoading(true);
      try {
        if (surahVerseData.length === 0) {
          setLoading(true);
          await fetchSurahInfo()
        } else {

        const translations = surahVerseData.verses.map((verse) => {
          const data = verse.translations.filter((trans) => trans.author === author && trans.language === language)
          return data[0];
        })
        // console.log(translations);
        setTranslationsArray(translations);
        }

        const audioData = await fetchAudioData();
        setAudios(audioData);

        fetchSurahTafseer()


      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }

    };
    initialize();

  }, [surah]);

  // console.log('loading: ', loading);
  // console.log('TranslationsArray:', translationsArray.length);
  // console.log('TranslationsArray:', translationsArray);

  if (loading === true) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#795547" />
      </View>
    );
  }

  const audioLoadHandler = async (index) => {
    if (audios.length === 0) {
      Alert.alert("Audio Not Available", "Please check your internet connection", [{ text: "Okay" }]);
      return;
    }
    setPlaying(true);
    await soundObject.unloadAsync();
    await soundObject.loadAsync({ uri: audios[index].audio });
    await soundObject.playAsync();
    soundObject.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) {
        setPlaying(false);
      }
    });
  };

  const audioStopHandler = async () => {
    setPlaying(false);
    await soundObject.stopAsync();
    await soundObject.unloadAsync();
  };

  // console.log('VersesOnline:', verses);
  // console.log('VersesOffline:', surahVerseData.verses);

  handleTafseerClick = (item) => {
    if (surahTafseer.length > 0) {
      setVerseTafseer(surahTafseer[item.verse - 1].text)
      setModalVisible2(true);
    } else {
      Alert.alert("Tafseer Not Available", "Please check your internet connection", [{ text: "Okay" }]);
    }
  }

  // console.log('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ'.slice(0, 40));
  // console.log('alm بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ'.replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ'.slice(0, 40), ""));

  return (
    <View style={styles.background}>
      <View style={styles.headingContainer}>
        <View style={styles.heading}>
          <Text style={{ fontSize: 24, color: 'white' }}>{surah.name}</Text>
          <Text style={{ color: 'white' }}>Chapter: {surah.chapter}</Text>
          <Text style={{ marginBottom: 5, color: 'white' }}>Verses: {surah.totalVerses}</Text>
          <Text style={{ color: 'white' }}>Revelation Place : </Text>
          <Text style={{ color: 'white' }}>{capitalizeFirstLetter(surah.revelationPlace)}</Text>
        </View>

        <View>
          <ImageBackground source={mosque} resizeMode="cover" style={styles.mosqueImage}></ImageBackground>
        </View>

        <Text style={{ textAlign: 'right', paddingTop: 5, fontSize: 24, color: 'white' }}>{surah.arabicName}</Text>
      </View>
      {surah.name !== 'Al-Fatihah' && <Text style={{ textAlign: 'center', fontSize: 25 }}>بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</Text>}
      
     {verses.length > 0 ? <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.verseContainer}
        data={verses}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => (
          <View style={styles.verseRow}>
            <View style={styles.controlsContainer}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {!playing ? (
                  <TouchableOpacity onPress={() => audioLoadHandler(index)}>
                    <Ionicons name="play" size={24} color="#5523A2" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={audioStopHandler}>
                    <Ionicons name="pause" size={24} color="#5523A2" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleTafseerClick(item)}>
                    <Ionicons name="book" size={24} color="#5523A2" />
                </TouchableOpacity>
              </View>
              <View style={{ backgroundColor: '#5523A2', width: 30, height: 30, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '900', fontSize: 12 }}>{index + 1}</Text>
              </View>
            </View>
            <View style={{ paddingVertical: 10 }}>
              <Text style={[styles.verseText, { fontSize: fontSize + 5 }]}>{surah.name === 'Al-Fatihah' ? item.data.text : arabicText === 'simple' ? item.data.text.replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', "") : arabicText === 'simplePlain' ? item.data.text.replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', "") : arabicText === 'simpleClean' ? item.data.text.replace('بسم الله الرحمن الرحيم', "") : arabicText === 'uthmani' ? item.data.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', "") : arabicText === 'uthmaniMinimal' ? item.data.text.replace('بِسمِ اللَّهِ الرَّحمـٰنِ الرَّحيمِ', "") : arabicText === 'simpleMinimal' ? item.data.text.replace('بِسمِ اللَّهِ الرَّحمـٰنِ الرَّحيمِ', "") : ''}</Text>

              {<Text style={[styles.translationText, { fontSize, fontStyle: language === 'en' || language === 'hi' ? 'italic' : 'normal' }]}>{item.data.translation}</Text>}

            </View>
          </View>
        )}
      /> : <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.verseContainer}
        data={surahVerseData.verses}
        keyExtractor={(item) => item.verse}
        renderItem={({ item, index }) => (
          <View style={styles.verseRow}>
            <View style={styles.controlsContainer}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {!playing ? (
                  <TouchableOpacity onPress={() => audioLoadHandler(index)}>
                    <Ionicons name="play" size={24} color="#5523A2" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={audioStopHandler}>
                    <Ionicons name="pause" size={24} color="#5523A2" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleTafseerClick(item)}>
                    <Ionicons name="book" size={24} color="#5523A2" />
                </TouchableOpacity>
              </View>
              <View style={{ backgroundColor: '#5523A2', width: 30, height: 30, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '900', fontSize: 12 }}>{item.verse}</Text>
              </View>
            </View>
            <View style={{ paddingVertical: 10 }}>
              {/* <Text style={[styles.verseText, { fontSize: fontSize + 5 }]}>{surah.name === 'Al-Fatihah' ? item[arabicText] ? item[arabicText] : item.text[arabicText] : item[arabicText] ? item[arabicText].replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', "") : item.text[arabicText].replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', "")}</Text> */}
              {/* <Text style={[styles.verseText, { fontSize: fontSize + 5 }]}>{surah.name === 'Al-Fatihah' ? item[arabicText] : item.text[arabicText].replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', "")}</Text> */}
              <Text style={[styles.verseText, { fontSize: fontSize + 5 }]}>{surah.name === 'Al-Fatihah' ? item.text[arabicText] : arabicText === 'simple' ?  item.text[arabicText].replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', "") : arabicText === 'simplePlain' ?  item.text[arabicText].replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', "") : arabicText === 'simpleClean' ?  item.text[arabicText].replace('بسم الله الرحمن الرحيم', "") : arabicText === 'uthmani' ?  item.text[arabicText].replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', "") : arabicText === 'uthmaniMinimal' ?  item.text[arabicText].replace('بِسمِ اللَّهِ الرَّحمـٰنِ الرَّحيمِ', "") : arabicText === 'simpleMinimal' ?  item.text[arabicText].replace('بِسمِ اللَّهِ الرَّحمـٰنِ الرَّحيمِ', "") : ''}</Text>

              

              {translationsArray.length > 0 && <Text style={[styles.translationText, { fontSize, fontStyle: language === 'en' || language === 'hi' ? 'italic' : 'normal' }]}>{translationsArray[index].translation}</Text>}

            </View>
          </View>
        )}
      />}


      {/* Modal Component */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: fontSize, marginBottom: 10, fontWeight: 'bold', fontStyle: 'italic' }}>Summary</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, {fontSize}]}>{summary}</Text>
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalVisible2}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible2(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: fontSize, marginBottom: 10, fontWeight: 'bold', fontStyle: 'italic' }}>Tafseer</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, {fontSize}]}>{verseTafseer}</Text>
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible2(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingContainer: {
    elevation: 5,
    backgroundColor: '#3B1A74',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
  },
  heading: {
    flexDirection: 'column',
  },
  mosqueImage: {
    flex: 1,
    width: 100,
    justifyContent: "center"
  },
  verseContainer: {
    margin: 8,
    padding: 10,
  },
  verseRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  controlsContainer: {
    elevation: 0.2,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F5FC',
  },
  verseText: {
    textAlign: 'right',
    flex: 1,
    fontWeight: 'bold'
  },
  translationText: {
    color: '#1B1A55',
    marginTop: 15,
    flex: 1,
    marginBottom: 10,
    paddingHorizontal: 5
  },
  summarizeButton: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  summarizeButtonText: {
    color: '#fff',
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '95%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'left',
  },
  modalText: {
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'justify',
  },
  closeButton: {
    backgroundColor: '#3B1A74',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default Verses;
