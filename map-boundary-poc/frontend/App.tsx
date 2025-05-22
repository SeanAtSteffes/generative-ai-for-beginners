import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker, Polygon, LatLng, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';

interface PolygonData {
  id: string;
  coordinates: LatLng[];
}

interface PinData {
  id: string;
  coordinate: LatLng;
  polygonId: string;
}

export default function App() {
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [currentCoords, setCurrentCoords] = useState<LatLng[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [pins, setPins] = useState<PinData[]>([]);

  const handleMapPress = (e: MapPressEvent) => {
    const coord = e.nativeEvent.coordinate;
    if (drawing) {
      setCurrentCoords([...currentCoords, coord]);
    } else {
      const found = polygons.find(p => pointInPolygon(coord, p.coordinates));
      if (found) {
        const newPin: PinData = { id: uuid.v4().toString(), coordinate: coord, polygonId: found.id };
        setPins([...pins, newPin]);
        fetch('http://localhost:5000/api/pins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ polygonId: found.id, latitude: coord.latitude, longitude: coord.longitude })
        }).catch(() => {});
      }
    }
  };

  const completePolygon = () => {
    if (currentCoords.length >= 3) {
      const newPoly: PolygonData = { id: uuid.v4().toString(), coordinates: currentCoords };
      setPolygons([...polygons, newPoly]);
      setCurrentCoords([]);
      setDrawing(false);
      fetch('http://localhost:5000/api/polygons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Area', points: currentCoords })
      }).catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} onPress={handleMapPress}>
        {polygons.map(p => (
          <Polygon key={p.id} coordinates={p.coordinates} strokeColor="black" fillColor="rgba(0,0,0,0.2)" />
        ))}
        {pins.map(m => (
          <Marker key={m.id} coordinate={m.coordinate} />
        ))}
        {drawing && currentCoords.length > 0 && (
          <Polygon coordinates={currentCoords} strokeColor="blue" fillColor="rgba(0,0,255,0.2)" />
        )}
      </MapView>
      <View style={styles.buttons}>
        {!drawing && <Button title="Add Polygon" onPress={() => setDrawing(true)} />}
        {drawing && <Button title="Finish" onPress={completePolygon} />}
      </View>
    </View>
  );
}

function pointInPolygon(point: LatLng, vs: LatLng[]) {
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].latitude, yi = vs[i].longitude;
    const xj = vs[j].latitude, yj = vs[j].longitude;

    const intersect = ((yi > point.longitude) !== (yj > point.longitude)) &&
      (point.latitude < (xj - xi) * (point.longitude - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttons: { position: 'absolute', bottom: 20, left: 20, right: 20 }
});
