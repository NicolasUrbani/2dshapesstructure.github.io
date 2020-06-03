clear all; close all;

% Load the dataset
load dataset.mat

% Load the parts similarity dataset
load selection.mat

for ind_shape = 1:size(selection,1)
    selection{ind_shape,2}  
    if ~strcmp(selection{ind_shape,2},'undefined')
        % Read the JSON file of the current shape
        shape_curr = readJSON(['JSON/' selection{ind_shape,2} '.json']);

        % Extract all annotations of the shape
        ind_a = 1;
        while (~strcmp([selection{ind_shape,2} '.json'],shape{ind_a,2}))
            ind_a = ind_a + 1;
        end
        annotations_curr = annotations(triplets(:,2)==ind_a);
        selected_a = selection{ind_shape,3} + 1;

        [parts,cuts] = detectParts(shape_curr,annotations_curr{selected_a});

        writePartsJSON(parts, annotations_curr{selected_a}, [selection{ind_shape,2} '_' int2str(selected_a - 1) '.json'])

%         subplot(1,2,1)
%         displayShape(shape_curr,annotations_curr{selected_a})
%     
%         subplot(1,2,2)
%         displayShapeParts(shape_curr,parts)
%         pause
%         close all
    end
end

% 
% % Read the JSON file of the device7-17 shape
% device7_17_shape = readJSON('JSON/device7-17.json');
% % Extract all annotations of the device7-17 shape
% ind_device7_17 = 1;
% while (~strcmp('device7-17.json',shape{ind_device7_17,2}))
%     ind_device7_17 = ind_device7_17 + 1;
% end
% annotations_device7_17 = annotations(triplets(:,2)==ind_device7_17);
% 
% 
% [parts,cuts] = detectParts(device7_17_shape,annotations_device7_17{14});
% 
% writePartsJSON(parts, annotations_device7_17{14}, 'device7-17.json')
% 
% subplot(1,2,1)
% displayShape(device7_17_shape,annotations_device7_17{14})
% 
% subplot(1,2,2)
% displayShapeParts(device7_17_shape,parts)