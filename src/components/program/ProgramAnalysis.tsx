
import { ProgramData } from "./types";

interface ProgramAnalysisProps {
  program: ProgramData;
}

export const ProgramAnalysis = ({ program }: ProgramAnalysisProps) => {
  return (
    <div className="space-y-8 p-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">Aperçu du programme</h3>
        <p className="text-gray-700 mb-4">{program.overview}</p>
        
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Objectifs globaux:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {program.globalObjectives.map((objective, index) => (
              <li key={index} className="text-gray-700">{objective}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Public cible:</h4>
          <p className="text-gray-700">{program.targetAudience}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Prérequis:</h4>
          <p className="text-gray-700">{program.prerequisites}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Méthodes d'évaluation:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {program.evaluationMethods.map((method, index) => (
              <li key={index} className="text-gray-700">{method}</li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="text-2xl font-semibold">Modules</h3>
      {program.modules.map((module, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">
            Module {index + 1}: {module.title}
          </h3>
          <p className="text-gray-600 mb-4">Durée: {module.duration}</p>
          
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2">Objectifs:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {module.objectives.map((objective, oIndex) => (
                <li key={oIndex} className="text-gray-700">{objective}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2">Contenu:</h4>
            <p className="text-gray-700 whitespace-pre-line">{module.content}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2">Activités:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {module.activities.map((activity, aIndex) => (
                <li key={aIndex} className="text-gray-700">{activity}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2">Ressources:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {module.resources.map((resource, rIndex) => (
                <li key={rIndex} className="text-gray-700">{resource}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
