function comp = compareNames(name1, name2)

    if ~isempty(name1) && name1(end) == ' '
        name1 = name1(1:end-1);
    end
    
    if ~isempty(name2) && name2(end) == ' '
        name2 = name2(1:end-1);
    end
    
    if isnumeric(name2) && isnumeric(name1)
        comp = (name1 == name2);
    else
        comp = strcmp(lower(name1), lower(name2));
    end
    
end