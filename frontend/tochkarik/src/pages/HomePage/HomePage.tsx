import { FC, useEffect, useState } from 'react';
import MapComponent from '../../components/Map/MapComponent';
import RadiusSlider from '../../components/Map/Slider/RadiusSlider';
import ManualLocationInput from '../../components/Map/ManualLocation/ManualLocationInput';
import ErrorMessage from '../../components/Map/ErrorMessage/ErrorMessage';
import GeneratedPoint from '../../components/Map/GeneratedPoint/GeneratedPoint';
import BigButton from '../../components/Buttons/BigButton';
import { axiosPublicInstance } from '../../services/authService';
import useLocationHandler from '../../components/Map/hooks/useLocationHandler';
import './HomePage.css';
import '../../components/Map/Map.css';


/**
 * Renders the HomePage component which displays a map with a radius slider and a button to generate a new point.
 *
 * @return {ReactElement} The rendered HomePage component.
 */
const HomePage: FC = () => {
    const [pointId, setPointId] = useState<number | null>(null);
    const [position, setPosition] = useState<[number, number] | null>([55.54885516305257, 37.54244046838186]);
    const [radius, setRadius] = useState<number>(500);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [street, setStreet] = useState<string>('');
    const [timeOfGenerate, setTimeOfGenerate] = useState<string>('');
    const [telemetryId, setTelemetryId] = useState<number>(0);
    const [generatedByRule, setGeneratedByRule] = useState<boolean>(false)

    const [showControls, setShowControls] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { getRandomCoordinatesWithPassability, getStreetName, getFormattedTime, isPointWithinAnyRuleRadius } = useLocationHandler();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setPosition([latitude, longitude]);
        });
    }, []);

    /**
     * Updates the radius state based on the value of the HTML input element.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event object containing the target input element.
     * @return {void} This function does not return anything.
     */
    const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(event.target.value));
    };

    const handleGenerate = async () => {
        const {coordinates: coordinatesRandomPosition, generatedByRule: isGeneratedByRule} = await getRandomCoordinatesWithPassability(position!, radius);
        setGeneratedByRule(isGeneratedByRule);
        setMarkerPosition(coordinatesRandomPosition);
        setPosition(coordinatesRandomPosition);

        const streetName = await getStreetName(coordinatesRandomPosition[0], coordinatesRandomPosition[1]);
        setStreet(streetName);

        const formattedTime = getFormattedTime(coordinatesRandomPosition[0], coordinatesRandomPosition[1])
        setTimeOfGenerate(formattedTime);

        setShowControls(false);

        await axiosPublicInstance.post('/point_telemetry', {
            name: 'Generated Point',
            coordinates: coordinatesRandomPosition,
            timeOfGenerate: formattedTime,
            description: street,
            isVisited: false,
            generatedByRule: isGeneratedByRule
        }).then(response => {
            setTelemetryId(response.data.data.id);
            console.log("RETURNED POINTTELEMETRY: ", response.data.data)
        });
    };

    const handleCreateReport = async () => {
        const rulePoints = await isPointWithinAnyRuleRadius(position!);
        await axiosPublicInstance.put(`/point_telemetry/${telemetryId}`, {
            isVisited: true,
            generatedByRule: generatedByRule
        })
        alert('In the future there will be functionality for creating a report')
    }

    const handleCancel = () => {
        setMarkerPosition(null);
        setShowControls(true);
        setStreet('');
        setTimeOfGenerate('');
        setPointId(null);
    };

    return (
        <div className="home-container">
            {position ? (
                <>
                    <MapComponent
                        coordinates={markerPosition}
                        showRadius={true}
                        radius={radius}
                        centerPosition={position}
                    />
                    {showControls ? (
                        <div className="controls-container">
                            <div className={"controls-container-wrapper"}>
                                {street}
                                <RadiusSlider radius={radius} handleRadiusChange={handleRadiusChange}/>
                                <BigButton onClick={handleGenerate}>Generate</BigButton>
                                <ManualLocationInput setPosition={setPosition} setError={setError}/>
                                {error && <ErrorMessage message={error}/>}
                            </div>
                        </div>
                    ) : (
                        <GeneratedPoint
                            pointId={pointId}
                            onSave={(id: number | null) => setPointId(id)}
                            street={street}
                            pointTitle="Point Generated"
                            isNew={true}
                            hasReport={false}
                            onCancel={handleCancel}
                            onCreateReport={handleCreateReport}
                            coordinates={markerPosition}
                            timeOfGenerate={timeOfGenerate}
                        />
                    )}
                </>
            ) : (
                <>WAIT</>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default HomePage;
