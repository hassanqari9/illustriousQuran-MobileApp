import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Modal, Image, TouchableOpacity } from "react-native";
import * as SQLite from 'expo-sqlite';
import mosque from '../assets/mosque.png';

const HomeScreen = ({ navigation }) => {

  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(0)
  const [open, setOpen] = useState(true);
  const [allSurahsData, setAllSurahsData] = useState([])

  const initDB = async () => {
    const db = await SQLite.openDatabaseAsync('surahs.db', {
      useNewConnection: true
    });
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS surahs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter TEXT NOT NULL,
        totalVerses INTEGER NOT NULL,
        name TEXT NOT NULL,
        nameTranslation TEXT,
        arabicName TEXT NOT NULL,
        revelationPlace TEXT,
        revelationOrder INTEGER,
        summarySource TEXT,
        summaryText TEXT
      );

      CREATE TABLE IF NOT EXISTS surah_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL
      );
    `);
    return db;
  }

  const insertSurahs = async (db, surahs) => {
    await db.execAsync('DELETE FROM surahs')
    const insertPromises = surahs.map(surah =>
      db.runAsync(
        `INSERT INTO surahs (chapter, totalVerses, name, nameTranslation, arabicName, revelationPlace, revelationOrder, summarySource, summaryText) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          surah.chapter,
          surah.totalVerses,
          surah.name,
          surah.nameTranslation,
          surah.arabicName,
          surah.revelationPlace,
          surah.revelationOrder,
          surah.summary?.source,
          surah.summary?.text
        ]
      )
    )
    await Promise.all(insertPromises);
  }

  const fetchSurahsFromDB = async (db) => {
    const allRows = await db.getAllAsync('SELECT * FROM surahs');
    const dbSurahs = allRows.map(item => ({
      chapter: item.chapter,
      totalVerses: item.totalVerses,
      name: item.name,
      nameTranslation: item.nameTranslation,
      arabicName: item.arabicName,
      revelationPlace: item.revelationPlace,
      revelationOrder: item.revelationOrder,
      summary: {
        source: item.summarySource,
        text: item.summaryText
      }
    }));
    // setSurahs(dbSurahs);
    return dbSurahs;
  };

    // const saveAllSurahsDataToDB = async (db, allSurahsData) => {
  //   const jsonString = JSON.stringify(allSurahsData);
  //   await db.runAsync('DELETE FROM surah_data');
  //   await db.runAsync('INSERT INTO surah_data (data) VALUES (?)', [jsonString]);
  // }

  const fetchAllSurahsDataFromDB = async (db) => {
    const allRows = await db.getAllAsync('SELECT data FROM surah_data LIMIT 1');
    if (allRows.length > 0) {
      const jsonString = allRows[0].data;
      const parsedData = JSON.parse(jsonString);
      return parsedData;
    }
    return [];
  }

  const fetchSurahsFromAPI = async () => {
    console.log("fetchSurahsFromAPI");
    setLoading(true);
    try {
      // const response = await fetch("http://192.168.29.253:3000/v1/scripture/chapterMetaData/all");
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/v1/scripture/chapterMetaData/all`);
      const data = await response.json();
      data?.data.sort((a, b) => a.chapter - b.chapter);
      // console.log("Surahs: ", data?.data);
      return data?.data;
    } catch (error) {
      console.error("Error fetching Quran surah names:", error);
      return [];
    }
  };

  // const fetchAllSurahsData = async () => {
  //   console.log("Fetching all Surahs data");
  //   setLoading(true);

  //   const allSurahsData = [];

  //   for (let chapter = 1; chapter <= 114; chapter++) {
  //     try {
  //       const response = await fetch(`https://illustriousquran-backend.onrender.com/v1/scripture/quraan/search/${chapter}`);
  //       const data = await response.json();
  //       if (data?.data) {
  //         data.data.sort((a, b) => a.verse - b.verse);
  //         console.log(`Chapter ${chapter}`);
  //         allSurahsData.push({ chapter, verses: data.data });
  //       }
  //     } catch (error) {
  //       console.error(`Error fetching data for chapter ${chapter}:`, error);
  //     }
  //     setLoadingStatus(parseInt(chapter / 114 * 100))
  //   }
  //   return allSurahsData;
  // };

  useEffect(() => {
    const initialize = async () => {
      const db = await initDB();

      
      const surahfromdb = await fetchSurahsFromDB(db);
      setSurahs(surahfromdb);
      // console.log(surahfromdb);
      if (surahfromdb.length === 0) {
        const apiSurahs = await fetchSurahsFromAPI();
        setSurahs(apiSurahs);
        await insertSurahs(db, apiSurahs);
      }

      const storedAllSurahsData = await fetchAllSurahsDataFromDB(db);
      if (storedAllSurahsData.length > 0) {
        setAllSurahsData(storedAllSurahsData);
      } else {
        // const fetchedAllSurahsData = await fetchAllSurahsData();
        // setAllSurahsData(fetchedAllSurahsData);
        // await saveAllSurahsDataToDB(db, fetchedAllSurahsData);
      }
      setLoading(false);

    }
    initialize();
  }, []);


  const handleSurahPress = (surah) => {
    // console.log(surah.chapter);
    // console.log(allSurahsData[surah.chapter - 1]);
    navigation.navigate('Verses', { surah, surahVerseData: allSurahsData.length > 0 ? allSurahsData[surah.chapter - 1] : []});
  };
  // allSurahsData[surah.chapter - 1]
  const renderSurahItem = ({ item }) => (
    <Pressable onPress={() => handleSurahPress(item)}>
      <View style={styles.surahContainer}>
        <View style={styles.innerContainer}>
          <View style={{elevation: 10}}>
          <View style={styles.numberContainer}>
            <Text style={[styles.surahItem, {color: '#3B1A74'}]}>{item.chapter}</Text>
          </View>
          </View>
          <View>
            <Text style={styles.surahItem}>{item.name}</Text>
            <Text style={styles.surahDescription}>{item.totalVerses} Verses</Text>
          </View>
        </View>
        <Text style={[[styles.surahItem, {color: '#3B1A74',  fontSize: 17}]]}>{item.arabicName}</Text>
      </View>
    </Pressable>
  );

  const renderModal = () => (
    <Modal visible={open} animationType="none">
      <View style={styles.modelContainer}>
        <View style={{padding: 15}}>
          <Text style={styles.title}>illustrious Quran</Text>
          <Text style={styles.subtitle}>Learn Quran and recite once everyday</Text>
        </View>
        <View style={{ alignItems: 'center', marginVertical: 25 }}>
          <Image source={mosque} />
        </View>
        {loading ? <ActivityIndicator size="large" color="#795547" /> : <TouchableOpacity style={styles.button} onPress={() => setOpen(false)}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>}
        {loading && <Text style={{ marginVertical: 10 }}>Loading Assets</Text>}
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {open && renderModal()}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={surahs}
        keyExtractor={(item) => item.chapter.toString()}
        renderItem={renderSurahItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B1A74',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    color: '#3B1A74',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#3B1A74',
    paddingVertical: 15,
    width: 150,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 9,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  surahContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  numberContainer: {
    borderColor: '#3B1A74',
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F8F5FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahItem: {
    fontSize: 16,
    paddingVertical: 5,
    color: 'black',
  },
  surahDescription: {
    color: 'grey',
    fontSize: 12,
  },
});

export default HomeScreen;
