// Import React and necessary libraries
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const FormBuilder = () => {
    const [questions, setQuestions] = useState([]);
    const [headerImage, setHeaderImage] = useState(null);
    const navigation = useNavigation(); // Initialize navigation
  
    const handlePreview = () => {
      navigation.navigate('FormPreview', { questions, headerImage });
    };
  
  const addQuestion = (type) => {
    setQuestions([...questions, { id: Date.now(), type, text: '', options: [], image: null }]);
  };

  const updateQuestion = (id, key, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const updateOption = (id, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const pickImage = (id = null) => {
    launchImageLibrary({}, (response) => {
      if (!response.didCancel && response.assets && response.assets[0].uri) {
        if (id) {
          updateQuestion(id, 'image', response.assets[0].uri);
        } else {
          setHeaderImage(response.assets[0].uri);
        }
      }
    });
  };

  const renderHeader = () => (
    <View>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage()}>
        <Text style={styles.headerText}>{headerImage ? 'Change Header Image' : 'Add Header Image'}</Text>
      </TouchableOpacity>
      {headerImage && <Image source={{ uri: headerImage }} style={styles.headerImage} />}

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={() => addQuestion('Text')}>
          <Text style={styles.actionButtonText}>Add Text Question</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => addQuestion('Grid')}>
          <Text style={styles.actionButtonText}>Add Grid Question</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => addQuestion('CheckBox')}>
          <Text style={styles.actionButtonText}>Add CheckBox Question</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
        <Text style={styles.previewButtonText}>Preview/Save Form</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = ({ item }) => (
    <View style={styles.questionContainer}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="Enter question text"
        placeholderTextColor="#aaa"
        value={item.text}
        onChangeText={(text) => updateQuestion(item.id, 'text', text)}
      />
      {item.type === 'CheckBox' || item.type === 'Grid' ? (
        <>
          {item.options.map((opt, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Option ${index + 1}`}
              placeholderTextColor="#aaa"
              value={opt}
              onChangeText={(text) => updateOption(item.id, index, text)}
            />
          ))}
          <TouchableOpacity style={styles.optionButton} onPress={() => addOption(item.id)}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path d="M12 4v16m8-8H4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.optionButtonText}>Add Option</Text>
          </TouchableOpacity>
        </>
      ) : null}
      {item.type === 'Grid' && <Text style={styles.infoText}>(Grid question should act as a radio group)</Text>}
      <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(item.id)}>
        <Text style={styles.imageButtonText}>Add Image</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={questions}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={renderQuestion}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  questionContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  imagePicker: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6200ea',
    borderRadius: 8,
    marginBottom: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    borderRadius: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#6200ea',
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#03dac5',
    borderRadius: 8,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#6200ea',
    borderRadius: 4,
    marginTop: 8,
  },
  optionButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  imageButton: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#03dac5',
    borderRadius: 4,
    marginTop: 8,
  },
  imageButtonText: {
    color: '#fff',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default FormBuilder;
