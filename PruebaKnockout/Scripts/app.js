var ViewModel = function () {
    var self = this;

    self.crrCarreraId = ko.observable();
    self.crrDescripcion = ko.observable();
    self.crrObservacion = ko.observable();
    self.crrAnulado = ko.observable();
    self.crrFechaCreacion = ko.observable();
    self.empEmpleadoIdCreador = ko.observable();
    self.crrFechaDesde = ko.observable();
    self.crrFechaHasta = ko.observable();
    self.EmpleadoNombre = ko.observable();
    self.selectedEmpleado = ko.observable();

    self.CarreraList = ko.observableArray([]);

    var carreraUri = 'http://localhost:61197/api/Carreras/';

    function ajaxFunction(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (err) {
            console.log(err);
            alert('Error  ' + err);
        });
    }


    self.clearFields = function clearFields() {
        self.crrCarreraId('');
        self.crrDescripcion('');
        self.crrObservacion('');
        self.crrAnulado('');
        self.crrFechaCreacion('');
        self.empEmpleadoIdCreador('');
        self.EmpleadoNombre('');
        self.crrFechaDesde('');
        self.crrFechaHasta('');
    }

    self.addNewCarrera = function addNewCarrera() {


        var CarreraObject = {
            crrCarreraId: self.crrCarreraId(),
            crrDescripcion: self.crrDescripcion(),
            crrObservacion: self.crrObservacion(),
            crrAnulado: self.crrAnulado(),
            crrFechaCreacion: self.crrFechaCreacion(),
            empEmpleadoIdCreador: self.empEmpleadoIdCreador(),
            crrFechaDesde: self.crrFechaDesde(),
            crrFechaHasta: self.crrFechaHasta(),
            selectedEmpleado: self.selectedEmpleado()

        }

        CarreraObject.empEmpleadoIdCreador = CarreraObject.selectedEmpleado.value;

        alert(CarreraObject.crrFechaDesde);
        console.log(CarreraObject.empEmpleadoIdCreador);

 
        ajaxFunction(carreraUri, 'POST', CarreraObject).done(function () {
            self.clearFields();
            alert('Carrera Added Successfully !');
            getCarreraList();
        });
    }

    function getCarreraList() {
        $("div.loadingZone").show();

        ajaxFunction(carreraUri, 'GET', null).done(function (data) {
            $("div.loadingZone").hide();
            self.CarreraList(data);

        });
    }

    self.detailCareer = function (selectedCareer) {

        self.crrCarreraId(selectedCareer.crrCarreraId);
        self.crrDescripcion(selectedCareer.crrDescripcion);
        self.crrObservacion(selectedCareer.crrObservacion);
        self.crrAnulado(selectedCareer.crrAnulado);
        self.crrFechaCreacion(selectedCareer.crrFechaCreacion);
        self.empEmpleadoIdCreador(selectedCareer.empEmpleadoIdCreador);
        self.EmpleadoNombre(selectedCareer.EmpleadoNombre)
        self.crrFechaDesde(selectedCareer.crrFechaDesde);
        self.crrFechaHasta(selectedCareer.crrFechaHasta);


        $('#Save').hide();
        $('#Clear').hide();

        $('#Update').show();
        $('#Cancel').show();

    };

    self.cancel = function () {

        self.clearFields();

        $('#Save').show();
        $('#Clear').show();

        $('#Update').hide();
        $('#Cancel').hide();
    }

    self.updateCareer = function () {
        var CarreraObject = {
            crrCarreraId: self.crrCarreraId(),
            crrDescripcion: self.crrDescripcion(),
            crrObservacion: self.crrObservacion(),
            crrAnulado: self.crrAnulado(),
            crrFechaCreacion: self.crrFechaCreacion(),
            empEmpleadoIdCreador: self.empEmpleadoIdCreador(),
            crrFechaDesde: self.crrFechaDesde(),
            crrFechaHasta: self.crrFechaHasta(),
            selectedEmpleado: self.selectedEmpleado()

        }

        if (CarreraObject.selectedEmpleado == null || CarreraObject.selectedEmpleado == 'undefined') {
            console.log(" No cambié");
        } else {
            console.log(" sIII cambié");
            CarreraObject.empEmpleadoIdCreador = CarreraObject.selectedEmpleado.value;
        }

        console.log(CarreraObject.empEmpleadoIdCreador);

      


        ajaxFunction(carreraUri + self.crrCarreraId(), 'PUT', CarreraObject).done(function () {
            self.clearFields();
            alert('Carrera update Successfully !');
            getCarreraList();
            self.cancel();
        });



    }


    self.deleteCarrer = function (selectedCareer) {
        alert('voy a borrar');
        ajaxFunction(carreraUri + selectedCareer.crrCarreraId, 'DELETE').done(function () {

            alert('Career Deleted Successfully');
            getCarreraList();
        })
    }


    function chartLine() {
        ajaxFunction(carreraUri + 'getCareerbyEmployee', 'GET').done(function (data) {
            console.log(data);
            Morris.Line({
                element: 'line-chart',
                data: data,
                xkey: 'NombreEmpleado',
                ykeys: ['Cantidad'],
                labels: ['Cantidad'],
                parseTime: false
            });
        });
    };




    chartLine();
    getCarreraList();


};

ko.bindingHandlers.AutoCompleteEmpleado = {
    init: function (element, valueAccessor, allBiindings, viewModel, bindingContext) {
        var settings = valueAccessor();
        var selectedEmpleado = settings.selected;
        var updateElementValueWithLabel = function (event, ui) {
            event.preventDefault();
            $(element).val(ui.item.label);
            if (typeof ui.item !== "undefined") {

              
                console.log(ui.item.value);
                selectedEmpleado(ui.item);
            }
        };

        $(element).autocomplete({
            minLength: 3,
            source: function (request, response) {
                $.ajax({
                    url: 'http://localhost:61197/api/Empleados/EmpleadoAutoComplete?query=' + request.term,
                    //data: {
                    //    query: request.term
                    //},
                    //dataType: "jsonp",
                    success: function (data) {
                        var empleadoData = data.map(function (element) {
                            return {
                                label: element.NombreEmpleado,
                                value: element.idEmpleado,
                                object: element
                            }
                        });
                        response(empleadoData);
                    }
                });
            },
            select: function (event, ui) {
                if (ui.item) {
                    updateElementValueWithLabel(event, ui);
                }
            }
            //focus: function (event, ui) {
            //    if (ui.item) {
            //        updateElementValueWithLabel(event, ui);
            //    }
            //},
            //change: function (event, ui) {
            //    if (ui.item) {
            //        updateElementValueWithLabel(event, ui);
            //    }
            //}
        });

    }
}

ko.applyBindings(new ViewModel());
