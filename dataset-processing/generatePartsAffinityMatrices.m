% Generate all shapes similarity matrices with/without context (definite positive?)

clear all; close all;

load userstudy2-processed.mat
% load partsannotation.mat

if ~exist('Results/Affinity')
    mkdir('Results/Affinity')
end

if ~exist('Results/Affinity/Images')
    mkdir('Results/Affinity/Images')
end

for i=1:size(selection,1)
% for i=1:1
    
    s = readJSON(['JSON/' selection{i,2} '.json']);
    sp = readJSONParts(['JSON/Parts/' selection{i,2} '_' int2str(selection{i,3}) '.json']);
    
    
    
    % Compute main parts of the shape
    hierarchy_0 = find(sp.hierarchy == 0);
    main_parts = [];
    for j=1:length(hierarchy_0)
        main_parts = [ main_parts ; sp.parts(hierarchy_0(j)) ];
    end
    main_parts = unique(main_parts);
    
    
    % Compute the affinity matrix of the annotations
   % [ affinity_matrix_with, affinity_matrix_without, n ] = computeAffinityMatrix(selection{i,1});
     [ affinity_matrix_with, affinity_matrix_without, n ] = computeAffinityMatrix_Yvette(selection{i,1});
    pause
    
    
    figure;
    set(gcf, 'Position', get(0, 'Screensize'));
    subplot(1,3,1)
    imshow(affinity_matrix_with)
    colormap default
    caxis([0 1])
    colorbar
    title('With Context')
    
    subplot(1,3,2)
    imshow(affinity_matrix_without)
    colormap default
    caxis([0 1])
    colorbar
    title('Without context')
    
    subplot(1,3,3)
    displayShapeParts(s,sp.parts)
    
    pause(0.1)
    saveas(gcf,['Results/Affinity/Images/' selection{i,2} '.tiff'])
    print(gcf, '-dtiff', ['Results/Affinity/Images/' selection{i,2} '.tiff']); 
    save(['Results/Affinity/' selection{i,2} '.mat'],'affinity_matrix_with', 'affinity_matrix_without');
    
    close all
    %     
%     h = figure
% 
%     a = subplot(1,2,1);
%     displayShapePartsClust(s,sp.parts,main_parts,result_clust_with);
%     ta = title(a, ['with context (' int2str(defpos_with) ')']);
%     
%     b = subplot(1,2,2);
%     displayShapePartsClust(s,sp.parts,main_parts,result_clust_without);
%     tb = title(b, ['without context (' int2str(defpos_without) ')']);
% 
%     saveas(h, ['Results/SpectralParts/' selection{i,2} '_' int2str(selection{i,3}) '.png']);
%     clear s sp h result_clust_with result_clust_without a b defpos_with defpos_without ta tb
%     close all
end